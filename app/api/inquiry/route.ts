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

    // Step 1: Create or find guest
    const guestRes = await fetch(`${LEGACY}/guests`, {
      method: 'POST', headers,
      body: JSON.stringify({
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        Phone: phone || '',
      }),
    })
    if (!guestRes.ok) {
      const err = await guestRes.json().catch(() => ({}))
      return NextResponse.json({ error: 'Failed to create guest', details: err }, { status: 400 })
    }
    const guestData = await guestRes.json()
    const guestId = guestData.Id || guestData.id

    // Step 2: Create a draft quote instead of an inquiry.
    // The /inquiries endpoint links the guest by ID but OwnerRez does not surface
    // contact details on the inquiry view — you have to manually edit them.
    // Creating a quote with SendQuoteEmail:false gives OwnerRez a fully linked
    // guest record with all contact info visible immediately, so you can send a
    // quote directly without any manual data entry.
    const quotePayload: Record<string, unknown> = {
      GuestId: guestId,
      PropertyId: propertyId,
      Adults: adults || 2,
      Children: 0,
      Pets: 0,
      SendQuoteEmail: false,
      Comments: message,
    }

    if (arrival) quotePayload.Arrival = arrival
    if (departure) quotePayload.Departure = departure

    const quoteRes = await fetch(`${LEGACY}/quotes`, {
      method: 'POST', headers,
      body: JSON.stringify(quotePayload),
    })

    const quoteText = await quoteRes.text()
    console.log('Quote (from inquiry) response:', quoteRes.status, quoteText.substring(0, 300))

    // Send our email notification regardless of quote success
    try {
      const propertyName = Object.keys(PROPERTY_NUMERIC_IDS).find(k => PROPERTY_NUMERIC_IDS[k] === propertyId) || slug
      await sendInquiryEmail({ propertyName: propertyName.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()), firstName, lastName, email, phone, arrival, departure, adults, message })
    } catch (e) { console.error('Email error:', e) }

    if (!quoteRes.ok) {
      console.error('Quote creation error:', quoteRes.status, quoteText)
      // Guest was created successfully — still a useful record in OwnerRez
      return NextResponse.json({ success: true, guestId, note: 'Inquiry received.' })
    }

    const quoteData = JSON.parse(quoteText)
    return NextResponse.json({
      success: true,
      quoteId: quoteData.Id || quoteData.id,
      guestId,
    })

  } catch (error) {
    console.error('Inquiry error:', error)
    return NextResponse.json({ error: 'Failed to send inquiry. Please try again or call us.' }, { status: 500 })
  }
}
