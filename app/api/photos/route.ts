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
  if (!email || !token) return NextResponse.json({ error: 'No credentials' }, { status: 500 })

  const creds = Buffer.from(`${email}:${token}`).toString('base64')
  const headers = {
    'Authorization': `Basic ${creds}`,
    'Content-Type': 'application/json',
    'User-Agent': 'FabVacayVibes/1.0',
  }

  const propertyId = PROPERTY_NUMERIC_IDS[slug]

  // Try v2 listings endpoint first (includes photos)
  const endpoints = [
    `https://api.ownerrez.com/v2/listings?property_id=${propertyId}`,
    `https://api.ownerrez.com/v2/properties/${propertyId}`,
  ]

  for (const url of endpoints) {
    const res = await fetch(url, { headers })
    const text = await res.text()
    if (res.ok) {
      const data = JSON.parse(text)
      return NextResponse.json({ 
        propertySlug: slug, 
        endpoint: url,
        raw: data 
      })
    }
    console.log(`${url} -> ${res.status}: ${text.substring(0, 100)}`)
  }

  return NextResponse.json({ error: 'Could not fetch photos from any endpoint' }, { status: 404 })
}
