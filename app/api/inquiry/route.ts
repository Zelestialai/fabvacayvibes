import { sendInquiryEmail } from '../../lib/email'
import { NextRequest, NextResponse } from 'next/server'

const LEGACY = 'https://app.ownerrez.com/api'
const V2 = 'https://api.ownerrez.com/v2'

const PROPERTY_NUMERIC_IDS: Record<string, number> = {
  'casa-grande':        398247,
  'owl-and-hare':       452868,
  'sierra-crest-haven': 479162,
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, firstName, lastName, email, phone, arrival, departure, adults, poolHeating, message } = body
    const includePoolHeating = poolHeating === true && slug === 'owl-and-hare'

    if (!slug || !firstName || !lastName || !email || !message) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 })
    }

    const propertyId = PROPERTY_NUMERIC_IDS[slug]
    if (!propertyId) return NextResponse.json({ error: 'Invalid property' }, { status: 400 })

    const emailVal = process.env.OWNERREZ_EMAIL
    const token = process.env.OWNERREZ_TOKEN
    if (!emailVal || !token) return NextResponse.json({ error: 'API credentials not configured' }, { status: 500 })

    const creds = Buffer.from(`${emailVal}:${token}`).toString('base64')
    const headers = {
      'Authorization': `Basic ${creds}`,
      'Content-Type': 'application/json',
      'User-Agent': 'FabVacayVibes/1.0',
    }

    // Step 1: Create guest via v2 API — the legacy /api/guests endpoint
    // only returns { Id, Tags } and silently ignores all contact fields.
    // The v2 API accepts first_name, last_name, email_addresses, phones.
    const guestRes = await fetch(`${V2}/guests`, {
      method: 'POST', headers,
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email_addresses: [{ address: email }],
        phones: phone ? [{ number: phone }] : [],
      }),
    })
    if (!guestRes.ok) {
      const errText = await guestRes.text()
      console.error('Guest creation failed:', guestRes.status, errText.substring(0, 300))
      return NextResponse.json({ error: 'Failed to create guest', details: errText.substring(0, 200) }, { status: 400 })
    }
    const guestData = await guestRes.json()
    const guestId = guestData.id || guestData.Id
    console.log('Guest created via v2:', guestId, JSON.stringify(guestData).substring(0, 200))

    // Step 2: Create a record in OwnerRez with the guest fully linked.
    // If dates are provided → create a draft quote (SendQuoteEmail:false) so you
    //   can send a payment link directly with no manual data entry.
    // If no dates → create an inquiry so it still shows up in OwnerRez.
    // In both cases the guest now has name/email/phone stored correctly.

    let ownerrezId: number | null = null
    let ownerrezType: 'quote' | 'inquiry' | null = null

    if (arrival && departure) {
      const POOL_HEATING_SURCHARGE_ID = 102655608
      const poolNote = includePoolHeating ? '\n\n[Pool heating requested]' : ''
      const quotePayload: Record<string, unknown> = {
        GuestId: guestId,
        PropertyId: propertyId,
        Adults: adults || 2,
        Children: 0,
        Pets: 0,
        SendQuoteEmail: false,
        Comments: message + poolNote,
        Arrival: arrival,
        Departure: departure,
        ...(includePoolHeating ? { OptionalSurchargeIds: [POOL_HEATING_SURCHARGE_ID] } : {}),
      }
      const quoteRes = await fetch(`${LEGACY}/quotes`, {
        method: 'POST', headers,
        body: JSON.stringify(quotePayload),
      })
      const quoteText = await quoteRes.text()
      console.log('Quote response:', quoteRes.status, quoteText.substring(0, 300))
      if (quoteRes.ok) {
        const quoteData = JSON.parse(quoteText)
        ownerrezId = quoteData.Id || quoteData.id
        ownerrezType = 'quote'

        // If pool heating requested, add it as an explicit charge on the quote
        if (includePoolHeating && ownerrezId) {
          const nights = Math.round((new Date(departure).getTime() - new Date(arrival).getTime()) / 86400000)
          // Fetch current rate from v2 surcharges API
          try {
            const srRes = await fetch(`${V2}/surcharges?property_ids=${propertyId}`, { headers })
            if (srRes.ok) {
              const srData = await srRes.json()
              const poolSurcharge = srData.items?.find((s: { id: number }) => s.id === 102655608)
              if (poolSurcharge) {
                const poolAmount = (poolSurcharge.amount as number) * nights
                // Try POST to quotes/{id}/charges (legacy API)
                const chargeRes = await fetch(`${LEGACY}/quotes/${ownerrezId}/charges`, {
                  method: 'POST', headers,
                  body: JSON.stringify({ Type: 2, Description: 'Pool Heating', Amount: poolAmount }),
                })
                const chargeText = await chargeRes.text()
                console.log('Pool heating charge POST:', chargeRes.status, chargeText.substring(0, 200))
              }
            }
          } catch (e) {
            console.error('Pool heating charge error:', e)
          }
        }
      } else {
        console.error('Quote creation failed:', quoteRes.status, quoteText)
      }
    }

    // Fall back to inquiry if no dates or quote failed
    if (!ownerrezId) {
      const poolNote = includePoolHeating ? '\n\n[Pool heating requested]' : ''
      const inquiryPayload: Record<string, unknown> = {
        GuestId: guestId,
        PropertyId: propertyId,
        Adults: adults || 2,
        Children: 0,
        Pets: 0,
        Comments: message + poolNote,
        Source: 'FabVacayVibes Website',
      }
      if (arrival) inquiryPayload.Arrival = arrival
      if (departure) inquiryPayload.Departure = departure

      const inqRes = await fetch(`${LEGACY}/inquiries`, {
        method: 'POST', headers,
        body: JSON.stringify(inquiryPayload),
      })
      const inqText = await inqRes.text()
      console.log('Inquiry fallback response:', inqRes.status, inqText.substring(0, 300))
      if (inqRes.ok) {
        const inqData = JSON.parse(inqText)
        ownerrezId = inqData.Id || inqData.id
        ownerrezType = 'inquiry'
      }
    }

    // Send our notification email regardless
    try {
      const propertyName = Object.keys(PROPERTY_NUMERIC_IDS).find(k => PROPERTY_NUMERIC_IDS[k] === propertyId) || slug
      await sendInquiryEmail({ propertyName: propertyName.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()), firstName, lastName, email, phone, arrival, departure, adults, poolHeating: includePoolHeating, message })
    } catch (e) { console.error('Email error:', e) }

    return NextResponse.json({
      success: true,
      ownerrezId,
      ownerrezType,
      guestId,
    })

  } catch (error) {
    console.error('Inquiry error:', error)
    return NextResponse.json({ error: 'Failed to send inquiry. Please try again or call us.' }, { status: 500 })
  }
}
