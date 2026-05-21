import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const input = searchParams.get('input')

  if (!input || input.length < 3) {
    return NextResponse.json({ suggestions: [] })
  }

  const GOOGLE_KEY = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_API_KEY

  if (!GOOGLE_KEY) {
    return NextResponse.json({ suggestions: [], debug: 'No API key found' })
  }

  try {
    // Use the newer Places API (New) with Text Search
    const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json')
    url.searchParams.set('input', input)
    url.searchParams.set('types', 'geocode')
    url.searchParams.set('components', 'country:us')
    url.searchParams.set('key', GOOGLE_KEY)

    const res = await fetch(url.toString(), { cache: 'no-store' })
    const data = await res.json()

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Places API error:', data.status, data.error_message)
      // Return debug info so we can see what's wrong
      return NextResponse.json({ 
        suggestions: [], 
        debug: `Google status: ${data.status}`,
        error: data.error_message 
      })
    }

    const suggestions = (data.predictions || []).map((p: { description: string; place_id: string }) => ({
      description: p.description,
      place_id: p.place_id,
    }))

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Places autocomplete error:', error)
    return NextResponse.json({ suggestions: [], debug: String(error) })
  }
}
