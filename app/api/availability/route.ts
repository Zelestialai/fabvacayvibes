import { NextRequest, NextResponse } from 'next/server'

const PROPERTY_NUMERIC_IDS: Record<string, number> = {
  'casa-grande':        398247,
  'owl-and-hare':       452868,
  'sierra-crest-haven': 479162,
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('property')

  if (!slug || !PROPERTY_NUMERIC_IDS[slug]) {
    return NextResponse.json({ error: 'Invalid property' }, { status: 400 })
  }

  const email = process.env.OWNERREZ_EMAIL
  const token = process.env.OWNERREZ_TOKEN
  if (!email || !token) return NextResponse.json({ error: 'API credentials not configured' }, { status: 500 })

  const creds = Buffer.from(`${email}:${token}`).toString('base64')
  const headers = {
    'Authorization': `Basic ${creds}`,
    'Content-Type': 'application/json',
    'User-Agent': 'FabVacayVibes/1.0',
  }

  const formatDate = (d: Date) => d.toISOString().split('T')[0]
  const today = new Date()
  const propertyId = PROPERTY_NUMERIC_IDS[slug]

  // Fetch 18 months of bookings using arrival_date_min/max
  // (NOT since_utc which filters by modification date, missing old bookings)
  const futureEnd = new Date(today)
  futureEnd.setMonth(futureEnd.getMonth() + 18)

  try {
    let allBookings: Record<string, unknown>[] = []
    let page = 1
    let hasMore = true

    // Paginate through all bookings for this property
    while (hasMore) {
      const url = new URL('https://api.ownerrez.com/v2/bookings')
      url.searchParams.set('property_id', String(propertyId))
      url.searchParams.set('arrival_date_min', formatDate(today))
      url.searchParams.set('arrival_date_max', formatDate(futureEnd))
      url.searchParams.set('page_size', '100')
      url.searchParams.set('page_num', String(page))

      const res = await fetch(url.toString(), { headers })

      if (!res.ok) {
        const errText = await res.text()
        console.error('OwnerRez bookings error:', res.status, errText)
        // Try fallback without date filters if param not supported
        break
      }

      const data = await res.json()
      const items = data.items || []
      allBookings = allBookings.concat(items)

      // Check if there are more pages
      hasMore = items.length === 100
      page++
    }

    // If no bookings returned (maybe arrival_date_min not supported), try without date filter
    if (allBookings.length === 0 && page === 2) {
      const fallbackRes = await fetch(
        `https://api.ownerrez.com/v2/bookings?property_id=${propertyId}&page_size=200`,
        { headers }
      )
      if (fallbackRes.ok) {
        const fallbackData = await fallbackRes.json()
        allBookings = fallbackData.items || []
      }
    }

    const bookedDates: string[] = []
    for (const booking of allBookings) {
      // Skip cancelled bookings (OwnerRez uses various status strings)
      const status = String(booking.status || '').toLowerCase()
      if (status === 'cancelled' || status === 'canceled' || status === 'denied') continue

      const arrival = new Date(booking.arrival as string)
      const departure = new Date(booking.departure as string)

      // Only include future bookings
      if (departure <= today) continue

      const cur = new Date(arrival)
      while (cur < departure) {
        const dateStr = formatDate(cur)
        if (!bookedDates.includes(dateStr)) {
          bookedDates.push(dateStr)
        }
        cur.setDate(cur.getDate() + 1)
      }
    }

    bookedDates.sort()

    return NextResponse.json(
      {
        propertySlug: slug,
        bookedDates,
        totalBookings: allBookings.length,
        fetchedAt: new Date().toISOString(),
      },
      { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' } }
    )
  } catch (error) {
    console.error('Availability error:', error)
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 })
  }
}
