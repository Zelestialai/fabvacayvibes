import { NextRequest, NextResponse } from 'next/server'

// Verified numeric IDs from OwnerRez API
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

  try {
    const bookingsRes = await fetch(
      `https://api.ownerrez.com/v2/bookings?since_utc=${formatDate(today)}&property_id=${propertyId}`,
      { headers }
    )

    if (!bookingsRes.ok) throw new Error(`Bookings fetch failed: ${bookingsRes.status}`)
    const bookingsData = await bookingsRes.json()
    const bookings = bookingsData.items || []

    const bookedDates: string[] = []
    for (const booking of bookings) {
      if (booking.status === 'Cancelled') continue
      const arrival = new Date(booking.arrival)
      const departure = new Date(booking.departure)
      const cur = new Date(arrival)
      while (cur < departure) {
        bookedDates.push(formatDate(cur))
        cur.setDate(cur.getDate() + 1)
      }
    }

    return NextResponse.json(
      { propertySlug: slug, bookedDates, fetchedAt: new Date().toISOString() },
      { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' } }
    )
  } catch (error) {
    console.error('Availability error:', error)
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 })
  }
}
