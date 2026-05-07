import { NextRequest, NextResponse } from 'next/server'

const PROPERTY_EXTERNAL_IDS: Record<string, string> = {
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

// Helper: get numeric property ID from external ID
async function getPropertyId(creds: string, slug: string): Promise<number | null> {
  const res = await fetch(`${BASE}/v2/properties`, { headers: getHeaders(creds) })
  if (!res.ok) throw new Error(`Properties fetch failed: ${res.status}`)
  const data = await res.json()
  console.log('All properties:', JSON.stringify(data.items?.map((p: {id: number, name: string, key?: string}) => ({ id: p.id, name: p.name, key: p.key }))))
  
  const extId = PROPERTY_EXTERNAL_IDS[slug]
  // Try matching by key, or just use position based on slug order
  const slugOrder = ['casa-grande', 'owl-and-hare', 'sierra-crest-haven']
  const idx = slugOrder.indexOf(slug)
  const property = data.items?.find((p: {id: number, key?: string}) => p.key === extId)
    || (data.items?.length > idx ? data.items[idx] : data.items?.[0])
  
  return property?.id || null
}

// GET: Test quote (pricing preview, no guest needed)
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

    console.log('Using propertyId:', propertyId)

    // Use TEST verb on v1.1/quotes — correct OwnerRez test quote endpoint
    const payload = {
      PropertyId: propertyId,
      Arrival: arrival,
      Departure: departure,
      Adults: adults,
      Children: children,
      Pets: pets,
    }
    console.log('POST v1.1/quotes TEST payload:', payload)

    const quoteRes = await fetch(`${BASE}/v1.1/quotes`, {
      method: 'TEST',
      headers: getHeaders(creds),
      body: JSON.stringify(payload),
    })

    console.log('Test quote status:', quoteRes.status)
    const quoteText = await quoteRes.text()
    console.log('Test quote response (first 1000):', quoteText.substring(0, 1000))

    if (!quoteRes.ok) {
      let err
      try { err = JSON.parse(quoteText) } catch { err = { message: quoteText.substring(0, 300) } }
      return NextResponse.json({ error: err.message || 'Quote failed', details: err }, { status: 400 })
    }

    const quoteData = JSON.parse(quoteText)
    
    // Handle both camelCase and PascalCase responses
    const charges: Array<{type?: string; Type?: string; name?: string; Name?: string; amount?: number; Amount?: number}> = 
      quoteData.charges || quoteData.Charges || []
    
    const getType = (c: typeof charges[0]) => (c.type || c.Type || '').toLowerCase()
    const getAmount = (c: typeof charges[0]) => c.amount || c.Amount || 0
    const getName = (c: typeof charges[0]) => c.name || c.Name || ''

    const rent = charges.find(c => getType(c) === 'rent')
    const fees = charges.filter(c => getType(c) === 'surcharge')
    const taxes = charges.filter(c => getType(c) === 'tax')
    const total = charges.reduce((sum, c) => sum + getAmount(c), 0)
    const nights = Math.round((new Date(departure).getTime() - new Date(arrival).getTime()) / 86400000)

    return NextResponse.json({
      propertyId, propertySlug: slug,
      arrival, departure, nights, adults, children, pets,
      pricing: {
        rent: rent ? getAmount(rent) : 0,
        rentLabel: rent ? getName(rent) : 'Nightly Rate',
        fees: fees.map(f => ({ name: getName(f), amount: getAmount(f) })),
        taxes: taxes.map(t => ({ name: getName(t), amount: getAmount(t) })),
        total,
        currency: 'USD',
      },
    }, { headers: { 'Cache-Control': 'no-store' } })

  } catch (error) {
    console.error('Quote GET error:', error)
    return NextResponse.json({
      error: 'Failed to calculate quote',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

// POST: Create real quote with guest → returns payment URL
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

    // Step 1: Create guest
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

    const guestText = await guestRes.text()
    console.log('Guest response:', guestRes.status, guestText.substring(0, 300))

    if (!guestRes.ok) {
      let err
      try { err = JSON.parse(guestText) } catch { err = { message: guestText } }
      return NextResponse.json({ error: 'Failed to create guest', details: err }, { status: 400 })
    }

    const guestData = JSON.parse(guestText)
    const guestId = guestData.id

    // Step 2: Create quote → get payment URL
    const origin = request.headers.get('origin') || 'https://fabvacayvibes.vercel.app'
    const quotePayload = {
      GuestId: guestId,
      PropertyId: propertyId,
      Arrival: arrival,
      Departure: departure,
      Adults: adults || 2,
      Children: children || 0,
      Pets: pets || 0,
      SendQuoteEmail: false,
      RedirectAfterBookingUrl: `${origin}/booking-confirmed`,
    }

    const quoteRes = await fetch(`${BASE}/v1.1/quotes`, {
      method: 'POST',
      headers: getHeaders(creds),
      body: JSON.stringify(quotePayload),
    })

    const quoteText = await quoteRes.text()
    console.log('Quote POST response:', quoteRes.status, quoteText.substring(0, 500))

    if (!quoteRes.ok) {
      let err
      try { err = JSON.parse(quoteText) } catch { err = { message: quoteText.substring(0, 300) } }
      return NextResponse.json({ error: 'Failed to create quote', details: err }, { status: 400 })
    }

    const quoteData = JSON.parse(quoteText)
    const paymentUrl = quoteData.payment_form_url || quoteData.PaymentFormUrl || 
                       quoteData.paymentFormUrl || quoteData.payment_url

    console.log('Payment URL:', paymentUrl)

    return NextResponse.json({
      quoteId: quoteData.id || quoteData.Id,
      paymentUrl,
      total: quoteData.total_amount || quoteData.TotalAmount || quoteData.total,
    })

  } catch (error) {
    console.error('Quote POST error:', error)
    return NextResponse.json({
      error: 'Failed to create booking',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
