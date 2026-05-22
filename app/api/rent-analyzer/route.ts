import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { address, bedrooms, bathrooms, guests, placeId } = await request.json()

    if (!address || !bedrooms) {
      return NextResponse.json({ error: 'Address and bedrooms are required' }, { status: 400 })
    }

    const AIRROI_KEY = process.env.AIRROI_API_KEY
    if (!AIRROI_KEY) return NextResponse.json({ error: 'API key not configured' }, { status: 500 })

    const PLACES_KEY = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_API_KEY

    const bedroomsInt = parseInt(bedrooms)
    const bathroomsFloat = parseFloat(bathrooms || bedrooms)
    const guestsInt = parseInt(guests) || bedroomsInt * 2

    // Step 1: Get lat/lng from place_id via Places API (New)
    let lat: number | null = null
    let lng: number | null = null
    let formattedAddress = address

    if (placeId && PLACES_KEY) {
      const placeRes = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}`,
        {
          headers: {
            'X-Goog-Api-Key': PLACES_KEY,
            'X-Goog-FieldMask': 'location,formattedAddress',
          }
        }
      )
      if (placeRes.ok) {
        const placeData = await placeRes.json()
        if (placeData.location) {
          lat = placeData.location.latitude
          lng = placeData.location.longitude
          formattedAddress = placeData.formattedAddress || address
        }
      }
    }

    // Step 2: Call AirROI - use lat/lng if available, otherwise pass address
    const calcUrl = new URL('https://api.airroi.com/calculator/estimate')
    if (lat !== null && lng !== null) {
      calcUrl.searchParams.set('latitude', String(lat))
      calcUrl.searchParams.set('longitude', String(lng))
    } else {
      calcUrl.searchParams.set('address', address)
    }
    calcUrl.searchParams.set('bedrooms', String(bedroomsInt))
    calcUrl.searchParams.set('baths', String(bathroomsFloat))
    calcUrl.searchParams.set('guests', String(guestsInt))
    calcUrl.searchParams.set('currency', 'usd')

    console.log('AirROI URL:', calcUrl.toString())
    console.log('lat:', lat, 'lng:', lng, 'address:', address)
    const calcRes = await fetch(calcUrl.toString(), {
      method: 'GET',
      headers: { 'x-api-key': AIRROI_KEY },
    })

    const calcText = await calcRes.text()
    console.log('AirROI calc response:', calcRes.status, calcText.substring(0, 500))

    if (!calcRes.ok) {
      return NextResponse.json({
        error: `Could not estimate revenue for this location. ${calcText.substring(0, 150)}`
      }, { status: 400 })
    }

    const calcData = JSON.parse(calcText)

    // Step 3: Get comparable listings
    const compsUrl = new URL('https://api.airroi.com/listings/comparables')
    if (lat !== null && lng !== null) {
      compsUrl.searchParams.set('latitude', String(lat))
      compsUrl.searchParams.set('longitude', String(lng))
    } else {
      compsUrl.searchParams.set('address', address)
    }
    compsUrl.searchParams.set('bedrooms', String(bedroomsInt))
    compsUrl.searchParams.set('baths', String(bathroomsFloat))
    compsUrl.searchParams.set('guests', String(guestsInt))
    compsUrl.searchParams.set('currency', 'usd')

    let comparables = null
    const compsRes = await fetch(compsUrl.toString(), {
      method: 'GET',
      headers: { 'x-api-key': AIRROI_KEY },
    })
    if (compsRes.ok) {
      const compsData = await compsRes.json()
      comparables = compsData?.listings?.slice(0, 6) || null
    }

    return NextResponse.json({
      address: formattedAddress,
      latitude: lat,
      longitude: lng,
      bedrooms: bedroomsInt,
      bathrooms: bathroomsFloat,
      guests: guestsInt,
      estimate: calcData,
      comparables,
    })

  } catch (error) {
    console.error('Rent analyzer error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
