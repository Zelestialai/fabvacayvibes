import { NextRequest, NextResponse } from 'next/server'

const PROPERTY_IDS: Record<string, string> = {
  'casa-grande':        'orp5b613a7x',
  'owl-and-hare':       'orp5b6e904x',
  'sierra-crest-haven': 'orp5b74fbax',
}

function getCredentials() {
  const email = process.env.OWNERREZ_EMAIL
  const token = process.env.OWNERREZ_TOKEN
  if (!email || !token) throw new Error('API credentials not configured')
  return Buffer.from(`${email}:${token}`).toString('base64')
}

const BASE = 'https://api.ownerrez.com'
const headers = (creds: string) => ({
  'Authorization': `Basic ${creds}`,
  'Content-Type': 'application/json',
  'User-Agent': 'FabVacayVibes/1.0',
})

// GET: Calculate a test quote (no guest needed, just pricing)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('property')
  const arrival = searchParams.get('arrival')
  const departure = searchParams.get('departure')
  const adults = parseInt(searchParams.get('adults') || '2')
  const children = parseInt(searchParams.get('children') || '0')
  const pets = parseInt(searchParams.get('pets') || '0')

  if (!slug || !arrival || !departure || !PROPERTY_IDS[slug]) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const creds = getCredentials()

    // First get the numeric property ID
    const propsRes = await fetch(`${BASE}/v2/properties`, { headers: headers(creds) })
    const propsData = await propsRes.json()
    const externalId = PROPERTY_IDS[slug]

    // Find property — try matching by key field
    const property = propsData.items?.find(
      (p: { id: number; key?: string; name: string }) =>
        p.key === externalId || p.name
    )

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    // Test quote — validates dates and returns pricing without saving
    const quoteRes = await fetch(`${BASE}/v1.1/quotes/test`, {
      method: 'POST',
      headers: headers(creds),
      body: JSON.stringify({
        PropertyId: property.id,
        Arrival: arrival,
        Departure: departure,
        Adults: adults,
        Children: children,
        Pets: pets,
      }),
    })

    if (!quoteRes.ok) {
      const err = await quoteRes.json()
      return NextResponse.json(
        { error: err.message || 'Dates unavailable or invalid', details: err },
        { status: 400 }
      )
    }

    const quoteData = await quoteRes.json()

    // Parse charges into friendly format
    const charges = quoteData.charges || []
    const rent = charges.find((c: { type: string }) => c.type === 'Rent')
    const fees = charges.filter((c: { type: string }) => c.type === 'Surcharge')
    const taxes = charges.filter((c: { type: string }) => c.type === 'Tax')
    const total = charges.reduce((sum: number, c: { amount: number }) => sum + c.amount, 0)

    // Calculate nights
    const nights = Math.round(
      (new Date(departure).getTime() - new Date(arrival).getTime()) / (1000 * 60 * 60 * 24)
    )

    return NextResponse.json({
      propertyId: property.id,
      propertySlug: slug,
      arrival,
      departure,
      nights,
      adults,
      children,
      pets,
      pricing: {
        rent: rent?.amount || 0,
        rentLabel: rent?.name || 'Nightly Rate',
        fees: fees.map((f: { name: string; amount: number }) => ({ name: f.name, amount: f.amount })),
        taxes: taxes.map((t: { name: string; amount: number }) => ({ name: t.name, amount: t.amount })),
        total,
        currency: 'USD',
      },
    }, {
      headers: { 'Cache-Control': 'no-store' }
    })

  } catch (error) {
    console.error('Quote error:', error)
    return NextResponse.json({ error: 'Failed to calculate quote' }, { status: 500 })
  }
}

// POST: Create a real quote with guest info and return payment URL
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, arrival, departure, adults, children, pets, guest } = body

    if (!slug || !arrival || !departure || !guest?.email || !PROPERTY_IDS[slug]) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const creds = getCredentials()

    // Step 1: Get property numeric ID
    const propsRes = await fetch(`${BASE}/v2/properties`, { headers: headers(creds) })
    const propsData = await propsRes.json()
    const externalId = PROPERTY_IDS[slug]
    const property = propsData.items?.find(
      (p: { id: number; key?: string }) => p.key === externalId || p.id
    )

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    // Step 2: Create guest
    const guestRes = await fetch(`${BASE}/v2/guests`, {
      method: 'POST',
      headers: headers(creds),
      body: JSON.stringify({
        first_name: guest.firstName,
        last_name: guest.lastName,
        email: guest.email,
        phone: guest.phone || '',
      }),
    })

    if (!guestRes.ok) {
      const err = await guestRes.json()
      return NextResponse.json({ error: 'Failed to create guest', details: err }, { status: 400 })
    }

    const guestData = await guestRes.json()
    const guestId = guestData.id

    // Step 3: Create quote with payment URL
    const origin = request.headers.get('origin') || 'https://fabvacayvibes.vercel.app'
    const quoteRes = await fetch(`${BASE}/v1.1/quotes`, {
      method: 'POST',
      headers: headers(creds),
      body: JSON.stringify({
        GuestId: guestId,
        PropertyId: property.id,
        Arrival: arrival,
        Departure: departure,
        Adults: adults || 2,
        Children: children || 0,
        Pets: pets || 0,
        SendQuoteEmail: false,
        RedirectAfterBookingUrl: `${origin}/booking-confirmed`,
      }),
    })

    if (!quoteRes.ok) {
      const err = await quoteRes.json()
      return NextResponse.json({ error: 'Failed to create quote', details: err }, { status: 400 })
    }

    const quoteData = await quoteRes.json()

    return NextResponse.json({
      quoteId: quoteData.id,
      paymentUrl: quoteData.payment_form_url || quoteData.PaymentFormUrl,
      total: quoteData.total_amount || quoteData.TotalAmount,
    })

  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}
