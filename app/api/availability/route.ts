import { NextRequest, NextResponse } from 'next/server'

const PROPERTY_SLUGS: Record<string, string> = {
  'casa-grande':        'orp5b613a7x',
  'owl-and-hare':       'orp5b6e904x',
  'sierra-crest-haven': 'orp5b74fbax',
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('property')

  if (!slug || !PROPERTY_SLUGS[slug]) {
    return NextResponse.json({ error: 'Invalid property' }, { status: 400 })
  }

  const email = process.env.OWNERREZ_EMAIL
  const token = process.env.OWNERREZ_TOKEN

  if (!email || !token) {
    return NextResponse.json({ error: 'API credentials not configured' }, { status: 500 })
  }

  const credentials = Buffer.from(`${email}:${token}`).toString('base64')
  const headers = {
    'Authorization': `Basic ${credentials}`,
    'Content-Type': 'application/json',
    'User-Agent': 'FabVacayVibes/1.0',
  }

  const formatDate = (d: Date) => d.toISOString().split('T')[0]
  const today = new Date()
  const nextYear = new Date(today)
  nextYear.setFullYear(today.getFullYear() + 1)

  try {
    // Step 1: Get all properties to find numeric ID
    const propsRes = await fetch('https://app.ownerrez.com/api/v2/properties', { headers })
    if (!propsRes.ok) throw new Error(`Properties fetch failed: ${propsRes.status}`)
    const propsData = await propsRes.json()

    // Step 2: Get bookings for all properties and filter by date range
    const bookingsRes = await fetch(
      `https://app.ownerrez.com/api/v2/bookings?since_utc=${formatDate(today)}&include_blocks=true`,
      { headers }
    )
    if (!bookingsRes.ok) throw new Error(`Bookings fetch failed: ${bookingsRes.status}`)
    const bookingsData = await bookingsRes.json()

    const externalId = PROPERTY_SLUGS[slug]
    const bookedDates: string[] = []

    // Find matching property numeric ID
    const matchedProp = propsData.items?.find((p: { id: number; key: string }) =>
      p.key === externalId
    )

    const bookings = bookingsData.items || []
    for (const booking of bookings) {
      // Match by property key or id
      const matchesProp = matchedProp
        ? booking.property_id === matchedProp.id
        : booking.property_key === externalId

      if (!matchesProp) continue
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
    console.error('OwnerRez API error:', error)
    return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 })
  }
}
