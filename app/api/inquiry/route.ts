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

    // Step 2: Create inquiry via legacy API
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

    const inquiryRes = await fetch(`${LEGACY}/inquiries`, {
      method: 'POST', headers,
      body: JSON.stringify(inquiryPayload),
    })

    const inquiryText = await inquiryRes.text()
    console.log('Inquiry response:', inquiryRes.status, inquiryText.substring(0, 300))

    if (!inquiryRes.ok) {
      // If inquiry endpoint fails, fall back — still send email via a quote inquiry
      // Log the error but return success since guest was created
      console.error('Inquiry API error:', inquiryRes.status, inquiryText)
      // Try alternative: send as a message/thread
      try {
        const property = Object.keys(PROPERTY_NUMERIC_IDS).find(k => PROPERTY_NUMERIC_IDS[k] === propertyId) || slug
        await sendInquiryEmail({ propertyName: property.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()), firstName, lastName, email, phone, arrival, departure, adults, message })
      } catch (e) { console.error('Email error:', e) }
      return NextResponse.json({
        success: true,
        guestId,
        note: 'Inquiry received. We will contact you shortly.',
      })
    }

    const inquiryData = JSON.parse(inquiryText)
    // Send email notification
    try {
      const property = Object.keys(PROPERTY_NUMERIC_IDS).find(k => PROPERTY_NUMERIC_IDS[k] === propertyId) || slug
      await sendInquiryEmail({ propertyName: property.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()), firstName, lastName, email, phone, arrival, departure, adults, message })
    } catch (e) { console.error('Email error:', e) }

    return NextResponse.json({
      success: true,
      inquiryId: inquiryData.Id || inquiryData.id,
      guestId,
    })

  } catch (error) {
    console.error('Inquiry error:', error)
    return NextResponse.json({ error: 'Failed to send inquiry. Please try again or call us.' }, { status: 500 })
  }
}
