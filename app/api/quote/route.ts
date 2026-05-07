import { NextRequest, NextResponse } from 'next/server'

const PROPERTY_EXTERNAL_IDS: Record<string, string> = {
  'casa-grande':        'orp5b613a7x',
  'owl-and-hare':       'orp5b6e904x',
  'sierra-crest-haven': 'orp5b74fbax',
}

// v2 API for properties/bookings/guests
const V2 = 'https://api.ownerrez.com/v2'
// Legacy API for quotes (not yet in v2)
const LEGACY = 'https://app.ownerrez.com/api'

function getCredentials() {
  const email = process.env.OWNERREZ_EMAIL
  const token = process.env.OWNERREZ_TOKEN
  if (!email || !token) throw new Error('API credentials not configured')
  return Buffer.from(`${email}:${token}`).toString('base64')
}

const getHeaders = (creds: string) => ({
  'Authorization': `Basic ${creds}`,
  'Content-Type': 'application/json',
  'User-Agent': 'FabVacayVibes/1.0',
})

async function getPropertyId(creds: string, slug: string): Promise<number | null> {
  const res = await fetch(`${V2}/properties`, { headers: getHeaders(creds) })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Properties fetch failed: ${res.status} — ${text.substring(0, 200)}`)
  }
  const data = await res.json()
  console.log('Properties:', JSON.stringify(data.items?.map((p: {id: number, name: string}) => ({ id: p.id, name: p.name }))))
  const slugOrder = ['casa-grande', 'owl-and-hare', 'sierra-crest-haven']
  const idx = slugOrder.indexOf(slug)
  return data.items?.[idx]?.id || data.items?.[0]?.id || null
}

// GET: Test quote — pricing preview
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('property')
  const arrival = searchParams.get('arrival')
  const departure = searchParams.get('departure')
  const adults = parseInt(searchParams.get('adults') || '2')
  const children = parseInt(searchParams.get('children') || '0')
  const pets = parseInt(searchParams.get('pets') || '0')

  if (!slug || !arrival || !departure || !PROPERTY_EXTERNAL_IDS[slug]) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const creds = getCredentials()
    const propertyId = await getPropertyId(creds, slug)
    if (!propertyId) return NextResponse.json({ error: 'Property not found' }, { status: 404 })

    console.log('Test quote for propertyId:', propertyId, arrival, '->', departure)

    const payload = { PropertyId: propertyId, Arrival: arrival, Departure: departure, Adults: adults, Children: children, Pets: pets }

    // Use TEST HTTP verb on legacy quotes endpoint
    const quoteRes = await fetch(`${LEGACY}/quotes`, {
      method: 'TEST',
      headers: getHeaders(creds),
      body: JSON.stringify(payload),
    })

    console.log('Test quote status:', quoteRes.status)
    const quoteText = await quoteRes.text()
    console.log('Test quote response:', quoteText.substring(0, 500))

    if (!quoteRes.ok) {
      let err
      try { err = JSON.parse(quoteText) } catch { err = { message: quoteText.substring(0, 300) } }
      return NextResponse.json({ error: err.message || 'Quote failed', details: err }, { status: 400 })
    }

    const q = JSON.parse(quoteText)
    const charges: Array<{type?: string; Type?: string; name?: string; Name?: string; amount?: number; Amount?: number}> =
      q.charges || q.Charges || []

    const gt = (c: typeof charges[0]) => { const t = c.type || c.Type; if (typeof t === "string") return t.toLowerCase(); if (t === 1) return "rent"; if (t === 2) return "surcharge"; if (t === 3) return "tax"; return String(t || "").toLowerCase() }
    const ga = (c: typeof charges[0]) => c.amount || c.Amount || 0
    const gn = (c: typeof charges[0]) => c.name || c.Name || ''

    const rent = charges.find(c => gt(c) === 'rent')
    const fees = charges.filter(c => gt(c) === 'surcharge')
    const taxes = charges.filter(c => gt(c) === 'tax')
    const total = charges.reduce((s, c) => s + ga(c), 0)
    const nights = Math.round((new Date(departure).getTime() - new Date(arrival).getTime()) / 86400000)

    return NextResponse.json({
      propertyId, propertySlug: slug, arrival, departure, nights, adults, children, pets,
      pricing: {
        rent: rent ? ga(rent) : 0,
        rentLabel: rent ? gn(rent) : 'Nightly Rate',
        fees: fees.map(f => ({ name: gn(f), amount: ga(f) })),
        taxes: taxes.map(t => ({ name: gn(t), amount: ga(t) })),
        total, currency: 'USD', _rawCharges: charges.slice(0,5),
      },
    }, { headers: { 'Cache-Control': 'no-store' } })

  } catch (error) {
    console.error('Quote GET error:', error)
    return NextResponse.json({ error: 'Failed to calculate quote', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

// POST: Create real quote with guest → return payment URL
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, arrival, departure, adults, children, pets, guest } = body

    if (!slug || !arrival || !departure || !guest?.email || !PROPERTY_EXTERNAL_IDS[slug]) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const creds = getCredentials()
    const propertyId = await getPropertyId(creds, slug)
    if (!propertyId) return NextResponse.json({ error: 'Property not found' }, { status: 404 })

    // Create guest via v2
    const guestRes = await fetch(`${V2}/guests`, {
      method: 'POST',
      headers: getHeaders(creds),
      body: JSON.stringify({ first_name: guest.firstName, last_name: guest.lastName, email: guest.email, phone: guest.phone || '' }),
    })
    const guestText = await guestRes.text()
    console.log('Guest:', guestRes.status, guestText.substring(0, 200))
    if (!guestRes.ok) {
      let err; try { err = JSON.parse(guestText) } catch { err = { message: guestText } }
      return NextResponse.json({ error: 'Failed to create guest', details: err }, { status: 400 })
    }
    const guestData = JSON.parse(guestText)

    // Create quote via legacy API
    const origin = request.headers.get('origin') || 'https://fabvacayvibes.vercel.app'
    const quoteRes = await fetch(`${LEGACY}/quotes`, {
      method: 'POST',
      headers: getHeaders(creds),
      body: JSON.stringify({
        GuestId: guestData.id,
        PropertyId: propertyId,
        Arrival: arrival, Departure: departure,
        Adults: adults || 2, Children: children || 0, Pets: pets || 0,
        SendQuoteEmail: false,
        RedirectAfterBookingUrl: `${origin}/booking-confirmed`,
      }),
    })
    const quoteText = await quoteRes.text()
    console.log('Quote POST:', quoteRes.status, quoteText.substring(0, 300))
    if (!quoteRes.ok) {
      let err; try { err = JSON.parse(quoteText) } catch { err = { message: quoteText.substring(0, 300) } }
      return NextResponse.json({ error: 'Failed to create quote', details: err }, { status: 400 })
    }
    const quoteData = JSON.parse(quoteText)
    const paymentUrl = quoteData.payment_form_url || quoteData.PaymentFormUrl || quoteData.paymentFormUrl

    return NextResponse.json({ quoteId: quoteData.id || quoteData.Id, paymentUrl, total: quoteData.total_amount || quoteData.TotalAmount })

  } catch (error) {
    console.error('Quote POST error:', error)
    return NextResponse.json({ error: 'Failed to create booking', details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
