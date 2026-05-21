import { NextRequest, NextResponse } from 'next/server'

const LEGACY = 'https://app.ownerrez.com/api'
const PROPERTY_IDS: Record<string, number> = {
  'casa-grande':        398247,
  'owl-and-hare':       452868,
  'sierra-crest-haven': 479162,
}

// Get a quote for a specific date range
async function getQuote(propertyId: number, arrival: string, departure: string, creds: string) {
  const headers = { 'Authorization': `Basic ${creds}`, 'Content-Type': 'application/json', 'User-Agent': 'FabVacayVibes/1.0' }
  
  // Create temp guest
  const guestRes = await fetch(`${LEGACY}/guests`, {
    method: 'POST', headers,
    body: JSON.stringify({ FirstName: 'Rate', LastName: 'Check', Email: `ratecheck+${Date.now()}@fabvacayvibes.com` }),
  })
  if (!guestRes.ok) return null
  const guest = await guestRes.json()

  // Get quote
  const quoteRes = await fetch(`${LEGACY}/quotes`, {
    method: 'POST', headers,
    body: JSON.stringify({ GuestId: guest.Id, PropertyId: propertyId, Arrival: arrival, Departure: departure, Adults: 2, Children: 0, Pets: 0, SendQuoteEmail: false }),
  })
  if (!quoteRes.ok) return null
  const quote = await quoteRes.json()

  // Extract nightly rate from charges
  const nightlyCharge = quote.Charges?.find((c: { Type: number }) => c.Type === 1)
  if (!nightlyCharge) return null

  const nights = Math.round((new Date(departure).getTime() - new Date(arrival).getTime()) / 86400000)
  return nightlyCharge.Amount / nights
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('property')
  if (!slug || !PROPERTY_IDS[slug]) return NextResponse.json({ error: 'Invalid property' }, { status: 400 })

  const email = process.env.OWNERREZ_EMAIL
  const token = process.env.OWNERREZ_TOKEN
  if (!email || !token) return NextResponse.json({ error: 'No credentials' }, { status: 500 })

  const creds = Buffer.from(`${email}:${token}`).toString('base64')
  const propertyId = PROPERTY_IDS[slug]

  // Sample 4 different weekday stays across next 6 months to get average
  const today = new Date()
  const samples = []
  const offsets = [30, 60, 90, 120] // days from now

  for (const offset of offsets) {
    const arrival = new Date(today)
    arrival.setDate(arrival.getDate() + offset)
    // Skip to a Monday to avoid weekend rates skewing too high
    while (arrival.getDay() !== 1) arrival.setDate(arrival.getDate() + 1)
    const departure = new Date(arrival)
    departure.setDate(departure.getDate() + 3) // 3-night stay

    const fmt = (d: Date) => d.toISOString().split('T')[0]
    try {
      const rate = await getQuote(propertyId, fmt(arrival), fmt(departure), creds)
      if (rate) samples.push(rate)
    } catch {}
  }

  if (samples.length === 0) return NextResponse.json({ error: 'Could not fetch rates' }, { status: 500 })

  const avg = Math.round(samples.reduce((a, b) => a + b, 0) / samples.length)
  const min = Math.round(Math.min(...samples))
  const max = Math.round(Math.max(...samples))

  return NextResponse.json({ slug, avgPerNight: avg, minPerNight: min, maxPerNight: max, samples, sampleCount: samples.length })
}
