import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { address, bedrooms, bathrooms, guests, placeId, lat: frontendLat, lng: frontendLng } = await request.json()

    if (!address || !bedrooms) {
      return NextResponse.json({ error: 'Address and bedrooms are required' }, { status: 400 })
    }

    const AIRROI_KEY = process.env.AIRROI_API_KEY
    if (!AIRROI_KEY) return NextResponse.json({ error: 'AIRROI_API_KEY not set' }, { status: 500 })

    const PLACES_KEY = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_API_KEY

    const bedroomsInt = parseInt(bedrooms)
    const bathroomsFloat = parseFloat(bathrooms || bedrooms)
    const guestsInt = parseInt(guests) || bedroomsInt * 2

    // Step 1: Get coordinates
    let lat: number | null = frontendLat || null
    let lng: number | null = frontendLng || null
    let formattedAddress = address

    // If no coords from frontend, geocode via Nominatim (free, no API key needed)
    if (!lat || !lng) {
      try {
        const cleanAddr = address.replace(/, USA$/, '').replace(/, United States$/, '')
        const nomUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cleanAddr)}&format=json&limit=1&countrycodes=us`
        const nomRes = await fetch(nomUrl, { headers: { 'User-Agent': 'FabVacayVibes/1.0 (fabvacayvibes.com)' } })
        const nomData = await nomRes.json()
        if (nomData?.[0]) {
          lat = parseFloat(nomData[0].lat)
          lng = parseFloat(nomData[0].lon)
          formattedAddress = nomData[0].display_name || address
        }
      } catch (e) {
        console.error('Nominatim error:', e)
      }
    }

    console.log(`lat=${lat} lng=${lng}`)

    // Step 2: Build AirROI request
    const calcUrl = new URL('https://api.airroi.com/calculator/estimate')
    
    if (lat !== null && lng !== null) {
      calcUrl.searchParams.set('lat', lat.toFixed(6))
      calcUrl.searchParams.set('lng', lng.toFixed(6))
    } else {
      // Strip ", USA" suffix that AirROI may not like
      const cleanAddress = address.replace(/, USA$/, '').replace(/, United States$/, '')
      calcUrl.searchParams.set('address', cleanAddress)
    }
    
    calcUrl.searchParams.set('bedrooms', String(bedroomsInt))
    calcUrl.searchParams.set('baths', String(bathroomsFloat))
    calcUrl.searchParams.set('guests', String(guestsInt))
    calcUrl.searchParams.set('currency', 'usd')

    console.log('AirROI URL:', calcUrl.toString())

    const calcRes = await fetch(calcUrl.toString(), {
      method: 'GET',
      headers: { 'x-api-key': AIRROI_KEY },
    })

    const calcText = await calcRes.text()
    console.log('AirROI response:', calcRes.status, calcText.substring(0, 300))

    if (!calcRes.ok) {
      return NextResponse.json({
        error: `Could not estimate revenue for this location. Try entering just the city and state (e.g. "Clearwater, FL").`
      }, { status: 400 })
    }

    const calcData = JSON.parse(calcText)

    // Step 3: Get comparables
    let comparables = null
    try {
      const compsUrl = new URL('https://api.airroi.com/listings/comparables')
      if (lat !== null && lng !== null) {
        compsUrl.searchParams.set('lat', lat.toFixed(6))
        compsUrl.searchParams.set('lng', lng.toFixed(6))
      } else {
        const cleanAddress = address.replace(/, USA$/, '').replace(/, United States$/, '')
        compsUrl.searchParams.set('address', cleanAddress)
      }
      compsUrl.searchParams.set('bedrooms', String(bedroomsInt))
      compsUrl.searchParams.set('baths', String(bathroomsFloat))
      compsUrl.searchParams.set('guests', String(guestsInt))
      compsUrl.searchParams.set('currency', 'usd')

      const compsRes = await fetch(compsUrl.toString(), { method: 'GET', headers: { 'x-api-key': AIRROI_KEY } })
      if (compsRes.ok) {
        const compsData = await compsRes.json()
        comparables = compsData?.listings?.slice(0, 6) || null
      }
    } catch (e) {
      console.error('Comps error:', e)
    }

    return NextResponse.json({
      address: formattedAddress,
      latitude: lat,
      longitude: lng,
      estimate: calcData,
      comparables,
    })

  } catch (error) {
    console.error('Rent analyzer error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
