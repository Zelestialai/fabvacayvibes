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

  // Go back 2 years to catch all future bookings regardless of when they were made
  const since = new Date()
  since.setFullYear(since.getFullYear() - 2)

  try {
    // Paginate using offset/limit (property_id filter is ignored by API — filter client-side)
    let allBookings: Record<string, unknown>[] = []
    let offset = 0
    const limit = 100
    let hasMore = true

    while (hasMore) {
      const url = `https://api.ownerrez.com/v2/bookings?since_utc=${formatDate(since)}&limit=${limit}&offset=${offset}`
      const res = await fetch(url, { headers })

      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`OwnerRez API error: ${res.status} ${errText}`)
      }

      const data = await res.json()
      const items: Record<string, unknown>[] = data.items || []

      // Filter to only this property client-side (API ignores property_id param)
      const propertyItems = items.filter(b => b.property_id === propertyId)
      allBookings = allBookings.concat(propertyItems)

      // Check if more pages exist
      hasMore = items.length === limit
      offset += limit

      // Safety cap at 500 total records
      if (offset >= 500) break
    }

    const today = formatDate(new Date())
    const bookedDates: string[] = []

    for (const booking of allBookings) {
      const status = String(booking.status || '').toLowerCase()

      // Skip cancelled bookings
      if (status === 'cancelled' || status === 'canceled') continue

      // Include both real bookings and blocks (is_block: true)
      const arrival = booking.arrival as string   // already "YYYY-MM-DD"
      const departure = booking.departure as string

      if (!arrival || !departure) continue

      // Skip bookings entirely in the past
      if (departure <= today) continue

      // Expand arrival→departure into individual dates
      const cur = new Date(arrival + 'T12:00:00Z') // noon UTC avoids DST edge cases
      const end = new Date(departure + 'T12:00:00Z')

      while (cur < end) {
        const dateStr = formatDate(cur)
        if (!bookedDates.includes(dateStr)) {
          bookedDates.push(dateStr)
        }
        cur.setUTCDate(cur.getUTCDate() + 1)
      }
    }

    bookedDates.sort()

    return NextResponse.json(
      { propertySlug: slug, bookedDates, totalBookings: allBookings.length, fetchedAt: new Date().toISOString() },
      { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' } }
    )
  } catch (error) {
    console.error('Availability error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
