import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { address, bedrooms, bathrooms, guests, placeId } = await request.json()

    if (!address || !bedrooms) {
      return NextResponse.json({ error: 'Address and bedrooms are required' }, { status: 400 })
    }

    const AIRROI_KEY = process.env.AIRROI_API_KEY
    const GOOGLE_KEY = process.env.GOOGLE_API_KEY

    if (!AIRROI_KEY) return NextResponse.json({ error: 'API key not configured' }, { status: 500 })

    // Step 1: Geocode address using Google Maps
    let lat: number, lng: number, formattedAddress: string

    if (GOOGLE_KEY) {
      // Use place_id from autocomplete for accurate geocoding, fallback to address text
      const geoQuery = placeId
        ? `place_id:${placeId}`
        : address
      const geoRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(geoQuery)}&key=${GOOGLE_KEY}`
      )
      const geoData = await geoRes.json()
      if (geoData.status !== 'OK' || !geoData.results?.[0]) {
        return NextResponse.json({ 
          error: `Geocoding failed: ${geoData.status} for query: ${geoQuery}`,
          debug: geoData 
        }, { status: 400 })
      }
      lat = geoData.results[0].geometry.location.lat
      lng = geoData.results[0].geometry.location.lng
      formattedAddress = geoData.results[0].formatted_address
    } else {
      // Fallback: use nominatim (free geocoder)
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
        { headers: { 'User-Agent': 'FabVacayVibes/1.0' } }
      )
      const geoData = await geoRes.json()
      if (!geoData?.[0]) {
        return NextResponse.json({ error: 'Could not find that address.' }, { status: 400 })
      }
      lat = parseFloat(geoData[0].lat)
      lng = parseFloat(geoData[0].lon)
      formattedAddress = geoData[0].display_name
    }

    const bedroomsInt = parseInt(bedrooms)
    const bathroomsFloat = parseFloat(bathrooms || bedrooms)
    const guestsInt = parseInt(guests) || bedroomsInt * 2

    // Step 2: Call AirROI calculator endpoint (GET with query params)
    const calcUrl = new URL('https://api.airroi.com/calculator/estimate')
    calcUrl.searchParams.set('latitude', String(lat))
    calcUrl.searchParams.set('longitude', String(lng))
    calcUrl.searchParams.set('bedrooms', String(bedroomsInt))
    calcUrl.searchParams.set('guests', String(guestsInt))
    calcUrl.searchParams.set('currency', 'usd')

    const calcRes = await fetch(calcUrl.toString(), {
      method: 'GET',
      headers: { 'x-api-key': AIRROI_KEY },
    })

    if (!calcRes.ok) {
      const errText = await calcRes.text()
      console.error('AirROI calculator error:', calcRes.status, errText)
      return NextResponse.json({ 
        error: 'Could not estimate revenue for this location. Please try a city or zip code instead of a street address.' 
      }, { status: 400 })
    }

    const calcData = await calcRes.json()

    // Step 3: Get comparable listings for richer context
    const compsUrl = new URL('https://api.airroi.com/listings/comparables')
    compsUrl.searchParams.set('latitude', String(lat))
    compsUrl.searchParams.set('longitude', String(lng))
    compsUrl.searchParams.set('bedrooms', String(bedroomsInt))
    compsUrl.searchParams.set('baths', String(bathroomsFloat))
    compsUrl.searchParams.set('guests', String(guestsInt))
    compsUrl.searchParams.set('currency', 'usd')

    let compsData = null
    const compsRes = await fetch(compsUrl.toString(), {
      method: 'GET',
      headers: { 'x-api-key': AIRROI_KEY },
    })
    if (compsRes.ok) {
      compsData = await compsRes.json()
    }

    // Step 4: Get market info
    const marketRes = await fetch('https://api.airroi.com/markets/lookup', {
      method: 'GET',
      headers: { 'x-api-key': AIRROI_KEY },
      // markets/lookup may need different params - try with coords
    })
    // Actually markets/lookup is a GET - check docs say it takes lat/lng as query params or POST
    // Let's use markets/search instead
    let marketData = null

    return NextResponse.json({
      address: formattedAddress,
      latitude: lat,
      longitude: lng,
      bedrooms: bedroomsInt,
      bathrooms: bathroomsFloat,
      guests: guestsInt,
      estimate: calcData,
      comparables: compsData?.listings?.slice(0, 6) || null,
    })

  } catch (error) {
    console.error('Rent analyzer error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
