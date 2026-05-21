import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const input = searchParams.get('input')

  if (!input || input.length < 3) {
    return NextResponse.json({ suggestions: [] })
  }

  const GOOGLE_KEY = process.env.GOOGLE_API_KEY
  if (!GOOGLE_KEY) return NextResponse.json({ suggestions: [] })

  try {
    const url = new URL('https://maps.googleapis.com/maps/api/place/autocomplete/json')
    url.searchParams.set('input', input)
    url.searchParams.set('types', '(regions)')  // cities, zip codes, addresses
    url.searchParams.set('components', 'country:us')  // US only
    url.searchParams.set('key', GOOGLE_KEY)

    const res = await fetch(url.toString())
    const data = await res.json()

    const suggestions = (data.predictions || []).map((p: {description: string; place_id: string}) => ({
      description: p.description,
      place_id: p.place_id,
    }))

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Places autocomplete error:', error)
    return NextResponse.json({ suggestions: [] })
  }
}
