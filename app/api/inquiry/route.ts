import { sendInquiryEmail } from '../../lib/email'
import { NextRequest, NextResponse } from 'next/server'

const LEGACY = 'https://app.ownerrez.com/api'

const PROPERTY_NUMERIC_IDS: Record<string, number> = {
  'casa-grande':        398247,
  'owl-and-hare':       452868,
  'sierra-crest-haven': 479162,
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, firstName, lastName, email, phone, arrival, departure, adults, message } = body

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

    // Step 1: Create guest — OwnerRez legacy API uses snake_case and
    // nested arrays for email/phone (not flat PascalCase fields)
    const guestRes = await fetch(`${LEGACY}/guests`, {
      method: 'POST', headers,
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email_addresses: [{ address: email }],
        phones: phone ? [{ number: phone }] : [],
      }),
    })
    if (!guestRes.ok) {
      const err = await guestRes.json().catch(() => ({}))
      return NextResponse.json({ error: 'Failed to create guest', details: err }, { status: 400 })
    }
    const guestData = await guestRes.json()
    const guestId = guestData.Id || guestData.id

    // Step 2: Create a record in OwnerRez with the guest fully linked.
    // If dates are provided → create a draft quote (SendQuoteEmail:false) so you
    //   can send a payment link directly with no manual data entry.
    // If no dates → create an inquiry so it still shows up in OwnerRez.
    // In both cases the guest now has name/email/phone stored correctly.

    let ownerrezId: number | null = null
    let ownerrezType: 'quote' | 'inquiry' | null = null

    if (arrival && departure) {
      const quotePayload = {
        GuestId: guestId,
        PropertyId: propertyId,
        Adults: adults || 2,
        Children: 0,
        Pets: 0,
        SendQuoteEmail: false,
        Comments: message,
        Arrival: arrival,
        Departure: departure,
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
      } else {
        console.error('Quote creation failed:', quoteRes.status, quoteText)
      }
    }

    // Fall back to inquiry if no dates or quote failed
    if (!ownerrezId) {
      const inquiryPayload: Record<string, unknown> = {
        GuestId: guestId,
        PropertyId: propertyId,
        Adults: adults || 2,
        Children: 0,
        Pets: 0,
        Comments: message,
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
      await sendInquiryEmail({ propertyName: propertyName.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()), firstName, lastName, email, phone, arrival, departure, adults, message })
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
