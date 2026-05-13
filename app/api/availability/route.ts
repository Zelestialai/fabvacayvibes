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
  const propertyId = PROPERTY_NUMERIC_IDS[slug]

  // Go back 2 years so we catch all future bookings regardless of when booked
  const since = new Date()
  since.setFullYear(since.getFullYear() - 2)

  try {
    let allPropertyBookings: Record<string, unknown>[] = []
    let offset = 0
    const limit = 100
    let hasMore = true

    // Paginate until we have all records (API returns all properties, we filter client-side)
    while (hasMore) {
      const url = `https://api.ownerrez.com/v2/bookings?since_utc=${formatDate(since)}&limit=${limit}&offset=${offset}`
      const res = await fetch(url, { headers, cache: 'no-store' })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`OwnerRez API error: ${res.status} ${errText}`)
      }

      const data = await res.json()
      const items: Record<string, unknown>[] = data.items || []

      // Filter to only this property
      const propertyItems = items.filter(b => b.property_id === propertyId)
      allPropertyBookings = allPropertyBookings.concat(propertyItems)

      // If we got a full page, there may be more
      hasMore = items.length === limit
      offset += limit

      // Safety cap
      if (offset >= 2000) break
    }

    const today = formatDate(new Date())
    const bookedDatesSet = new Set<string>()

    for (const booking of allPropertyBookings) {
      const status = String(booking.status || '').toLowerCase()

      // Skip cancelled bookings only
      if (status === 'cancelled' || status === 'canceled') continue

      const arrival = booking.arrival as string   // "YYYY-MM-DD"
      const departure = booking.departure as string

      if (!arrival || !departure) continue
      if (departure <= today) continue

      // Expand each night from arrival up to (not including) departure
      const cur = new Date(arrival + 'T12:00:00Z')
      const end = new Date(departure + 'T12:00:00Z')

      while (cur < end) {
        bookedDatesSet.add(formatDate(cur))
        cur.setUTCDate(cur.getUTCDate() + 1)
      }
    }

    const bookedDates = Array.from(bookedDatesSet).sort()

    return NextResponse.json(
      {
        propertySlug: slug,
        bookedDates,
        totalBookings: allPropertyBookings.length,
        fetchedAt: new Date().toISOString(),
      },
      // Short cache — 60s max so fresh data shows quickly
      { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=120' } }
    )
  } catch (error) {
    console.error('Availability error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
