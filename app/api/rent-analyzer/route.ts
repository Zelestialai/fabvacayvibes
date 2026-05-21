import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { address, bedrooms, bathrooms, guests } = await request.json()

    if (!address || !bedrooms) {
      return NextResponse.json({ error: 'Address and bedrooms are required' }, { status: 400 })
    }

    const AIRROI_KEY = process.env.AIRROI_API_KEY
    if (!AIRROI_KEY) return NextResponse.json({ error: 'API key not configured' }, { status: 500 })

    // Step 1: Geocode address using Google Maps Geocoding API
    const GOOGLE_KEY = process.env.GOOGLE_API_KEY
    const geoRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_KEY}`
    )
    const geoData = await geoRes.json()

    if (geoData.status !== 'OK' || !geoData.results?.[0]) {
      return NextResponse.json({ error: 'Could not find that address. Please try a more specific address.' }, { status: 400 })
    }

    const location = geoData.results[0].geometry.location
    const formattedAddress = geoData.results[0].formatted_address
    const lat = location.lat
    const lng = location.lng

    // Step 2: Call AirROI calculator endpoint
    const calcRes = await fetch('https://api.airroi.com/calculator/estimate', {
      method: 'POST',
      headers: {
        'x-api-key': AIRROI_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude: lat,
        longitude: lng,
        bedrooms: parseInt(bedrooms),
        guests: parseInt(guests) || parseInt(bedrooms) * 2,
      }),
    })

    if (!calcRes.ok) {
      const err = await calcRes.text()
      console.error('AirROI error:', calcRes.status, err)
      return NextResponse.json({ error: 'Could not estimate revenue for this location. Try a nearby city address.' }, { status: 400 })
    }

    const calcData = await calcRes.json()

    // Step 3: Get market metrics for context
    const marketRes = await fetch('https://api.airroi.com/markets/lookup', {
      method: 'POST',
      headers: { 'x-api-key': AIRROI_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude: lat, longitude: lng }),
    })
    let marketData = null
    if (marketRes.ok) {
      marketData = await marketRes.json()
    }

    return NextResponse.json({
      address: formattedAddress,
      latitude: lat,
      longitude: lng,
      estimate: calcData,
      market: marketData,
    })
  } catch (error) {
    console.error('Rent analyzer error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
