import { NextRequest, NextResponse } from 'next/server'

const PROPERTY_NUMERIC_IDS: Record<string, number> = {
  'casa-grande':        398247,
  'owl-and-hare':       452868,
  'sierra-crest-haven': 479162,
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('property') || 'owl-and-hare'
  const propertyId = PROPERTY_NUMERIC_IDS[slug]

  const email = process.env.OWNERREZ_EMAIL
  const token = process.env.OWNERREZ_TOKEN
  if (!email || !token) return NextResponse.json({ error: 'No credentials' })

  const creds = Buffer.from(`${email}:${token}`).toString('base64')
  const headers = { 'Authorization': `Basic ${creds}`, 'Content-Type': 'application/json', 'User-Agent': 'FabVacayVibes/1.0' }

  const results: Record<string, unknown> = {}

  // Test 1: with arrival_date_min
  const url1 = `https://api.ownerrez.com/v2/bookings?property_id=${propertyId}&arrival_date_min=2026-05-01&page_size=10`
  const r1 = await fetch(url1, { headers })
  results.test1_arrival_date_min = { status: r1.status, url: url1, body: await r1.json().catch(() => 'parse error') }

  // Test 2: plain no filter
  const url2 = `https://api.ownerrez.com/v2/bookings?property_id=${propertyId}&page_size=10`
  const r2 = await fetch(url2, { headers })
  results.test2_no_filter = { status: r2.status, body: await r2.json().catch(() => 'parse error') }

  // Test 3: since_utc far back
  const url3 = `https://api.ownerrez.com/v2/bookings?property_id=${propertyId}&since_utc=2026-01-01&page_size=10`
  const r3 = await fetch(url3, { headers })
  results.test3_since_utc_jan = { status: r3.status, body: await r3.json().catch(() => 'parse error') }

  // Test 4: first booking details
  const url4 = `https://api.ownerrez.com/v2/bookings?property_id=${propertyId}&page_size=3`
  const r4 = await fetch(url4, { headers })
  const d4 = await r4.json().catch(() => ({}))
  results.test4_sample_booking = {
    status: r4.status,
    total_count: d4.total_count,
    fields: d4.items?.[0] ? Object.keys(d4.items[0]) : [],
    sample: d4.items?.[0] || null,
  }

  return NextResponse.json(results, { headers: { 'Cache-Control': 'no-store' } })
}
