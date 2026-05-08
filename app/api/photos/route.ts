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
  const res = await fetch(`https://api.ownerrez.com/v2/properties/${propertyId}/photos`, { headers })
  
  if (!res.ok) {
    const text = await res.text()
    return NextResponse.json({ error: `Photos fetch failed: ${res.status}`, details: text.substring(0, 300) }, { status: 500 })
  }

  const data = await res.json()
  // Return photos with just what we need
  return NextResponse.json({
    propertySlug: slug,
    photos: data.items?.map((p: {
      id: number
      url: string
      caption?: string
      position?: number
      is_primary?: boolean
    }) => ({
      id: p.id,
      url: p.url,
      caption: p.caption || '',
      position: p.position || 0,
      isPrimary: p.is_primary || false,
    })) || []
  })
}
