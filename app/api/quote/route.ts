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
const getHeaders = (creds: string) => ({
  'Authorization': `Basic ${creds}`,
  'Content-Type': 'application/json',
  'User-Agent': 'FabVacayVibes/1.0',
})

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

    // Step 1: Get all properties to find numeric ID
    console.log('Fetching properties...')
    const propsRes = await fetch(`${BASE}/v2/properties`, { headers: getHeaders(creds) })
    console.log('Properties status:', propsRes.status)
    
    if (!propsRes.ok) {
      const text = await propsRes.text()
      console.log('Properties error:', text)
      return NextResponse.json({ error: `Properties fetch failed: ${propsRes.status}`, details: text }, { status: 500 })
    }

    const propsData = await propsRes.json()
    console.log('Properties found:', propsData.items?.length, propsData.items?.map((p: {id: number, name: string}) => ({ id: p.id, name: p.name })))

    // Use first property as fallback if key matching fails
    const property = propsData.items?.[0]
    
    if (!property) {
      return NextResponse.json({ error: 'No properties found in OwnerRez account' }, { status: 404 })
    }

    console.log('Using property:', property.id, property.name)

    // Step 2: Test quote
    const quotePayload = {
      PropertyId: property.id,
      Arrival: arrival,
      Departure: departure,
      Adults: adults,
      Children: children,
      Pets: pets,
    }
    console.log('Quote payload:', quotePayload)

    const quoteRes = await fetch(`${BASE}/v1.1/quotes/test`, {
      method: 'POST',
      headers: getHeaders(creds),
      body: JSON.stringify(quotePayload),
    })

    console.log('Quote status:', quoteRes.status)
    const quoteText = await quoteRes.text()
    console.log('Quote response:', quoteText.substring(0, 500))

    if (!quoteRes.ok) {
      let err
      try { err = JSON.parse(quoteText) } catch { err = { message: quoteText } }
      return NextResponse.json({ error: err.message || 'Quote failed', details: err }, { status: 400 })
    }

    const quoteData = JSON.parse(quoteText)
    const charges = quoteData.charges || quoteData.Charges || []
    
    console.log('Charges:', charges)

    const rent = charges.find((c: {type?: string; Type?: string}) => 
      (c.type || c.Type) === 'Rent' || (c.type || c.Type) === 'rent'
    )
    const fees = charges.filter((c: {type?: string; Type?: string}) => 
      (c.type || c.Type) === 'Surcharge' || (c.type || c.Type) === 'surcharge'
    )
    const taxes = charges.filter((c: {type?: string; Type?: string}) => 
      (c.type || c.Type) === 'Tax' || (c.type || c.Type) === 'tax'
    )
    const total = charges.reduce((sum: number, c: {amount?: number; Amount?: number}) => 
      sum + (c.amount || c.Amount || 0), 0
    )

    const nights = Math.round(
      (new Date(departure).getTime() - new Date(arrival).getTime()) / (1000 * 60 * 60 * 24)
    )

    return NextResponse.json({
      propertyId: property.id,
      propertySlug: slug,
      arrival, departure, nights, adults, children, pets,
      pricing: {
        rent: rent?.amount || rent?.Amount || 0,
        rentLabel: rent?.name || rent?.Name || 'Nightly Rate',
        fees: fees.map((f: {name?: string; Name?: string; amount?: number; Amount?: number}) => ({ 
          name: f.name || f.Name, amount: f.amount || f.Amount || 0 
        })),
        taxes: taxes.map((t: {name?: string; Name?: string; amount?: number; Amount?: number}) => ({ 
          name: t.name || t.Name, amount: t.amount || t.Amount || 0 
        })),
        total,
        currency: 'USD',
      },
      // Include raw for debugging
      _raw: quoteData,
    }, { headers: { 'Cache-Control': 'no-store' } })

  } catch (error) {
    console.error('Quote error:', error)
    return NextResponse.json({ 
      error: 'Failed to calculate quote', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, arrival, departure, adults, children, pets, guest } = body

    if (!slug || !arrival || !departure || !guest?.email || !PROPERTY_IDS[slug]) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const creds = getCredentials()

    // Get property
    const propsRes = await fetch(`${BASE}/v2/properties`, { headers: getHeaders(creds) })
    const propsData = await propsRes.json()
    const property = propsData.items?.[0]
    if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 })

    // Create guest
    const guestRes = await fetch(`${BASE}/v2/guests`, {
      method: 'POST',
      headers: getHeaders(creds),
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

    // Create quote
    const origin = request.headers.get('origin') || 'https://fabvacayvibes.vercel.app'
    const quoteRes = await fetch(`${BASE}/v1.1/quotes`, {
      method: 'POST',
      headers: getHeaders(creds),
      body: JSON.stringify({
        GuestId: guestData.id,
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

    const quoteText = await quoteRes.text()
    if (!quoteRes.ok) {
      let err
      try { err = JSON.parse(quoteText) } catch { err = { message: quoteText } }
      return NextResponse.json({ error: 'Failed to create quote', details: err }, { status: 400 })
    }

    const quoteData = JSON.parse(quoteText)
    return NextResponse.json({
      quoteId: quoteData.id || quoteData.Id,
      paymentUrl: quoteData.payment_form_url || quoteData.PaymentFormUrl,
      total: quoteData.total_amount || quoteData.TotalAmount,
    })

  } catch (error) {
    console.error('Booking POST error:', error)
    return NextResponse.json({ 
      error: 'Failed to create booking',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
