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

  const since = new Date()
  since.setFullYear(since.getFullYear() - 2)
  const sinceStr = since.toISOString().split('T')[0]

  // Paginate all pages
  let allItems: Record<string, unknown>[] = []
  let offset = 0
  const limit = 100
  let pages = 0
  let hasMore = true

  while (hasMore) {
    const res = await fetch(`https://api.ownerrez.com/v2/bookings?since_utc=${sinceStr}&limit=${limit}&offset=${offset}`, { headers, cache: 'no-store' })
    const data = await res.json()
    const items = data.items || []
    allItems = allItems.concat(items)
    hasMore = items.length === limit
    offset += limit
    pages++
    if (offset >= 2000) break
  }

  const forProperty = allItems.filter(b => b.property_id === propertyId)
  const today = new Date().toISOString().split('T')[0]
  const futureActive = forProperty.filter(b => {
    const status = String(b.status || '').toLowerCase()
    return status !== 'cancelled' && status !== 'canceled' && (b.departure as string) > today
  })

  return NextResponse.json({
    slug, propertyId, sinceDate: sinceStr,
    pages_fetched: pages,
    totalAllProperties: allItems.length,
    totalThisProperty: forProperty.length,
    futureActiveCount: futureActive.length,
    futureActiveBookings: futureActive.map(b => ({
      id: b.id, arrival: b.arrival, departure: b.departure,
      status: b.status, is_block: b.is_block, listing_site: b.listing_site,
    })),
  }, { headers: { 'Cache-Control': 'no-store' } })
}
