import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const input = searchParams.get('input')

  if (!input || input.length < 3) {
    return NextResponse.json({ suggestions: [] })
  }

  const GOOGLE_KEY = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_API_KEY
  if (!GOOGLE_KEY) return NextResponse.json({ suggestions: [] })

  try {
    // Use Places API (New) - Autocomplete endpoint
    const res = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': GOOGLE_KEY,
      },
      body: JSON.stringify({
        input,
        includedRegionCodes: ['us'],
        languageCode: 'en',
      }),
      cache: 'no-store',
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('Places API (New) error:', data)
      return NextResponse.json({ suggestions: [] })
    }

    const rawSuggestions = (data.suggestions || [])
      .filter((s: { placePrediction?: { text?: { text: string }; placeId?: string } }) => s.placePrediction)
      .map((s: { placePrediction: { text: { text: string }; placeId: string } }) => ({
        description: s.placePrediction.text.text,
        place_id: s.placePrediction.placeId,
      }))

    return NextResponse.json({ suggestions: rawSuggestions })
  } catch (error) {
    console.error('Places autocomplete error:', error)
    return NextResponse.json({ suggestions: [] })
  }
}
