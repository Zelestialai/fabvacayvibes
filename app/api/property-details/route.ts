import { NextRequest, NextResponse } from 'next/server'

const PROPERTY_IDS: Record<string, number> = {
  'casa-grande': 398247,
  'owl-and-hare': 452868,
  'sierra-crest-haven': 479162,
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  const email = process.env.OWNERREZ_EMAIL
  const token = process.env.OWNERREZ_TOKEN
  if (!email || !token) return NextResponse.json({ error: 'No credentials' }, { status: 500 })

  const creds = Buffer.from(`${email}:${token}`).toString('base64')
  const headers = { 'Authorization': `Basic ${creds}`, 'User-Agent': 'FabVacayVibes/1.0' }

  if (slug && PROPERTY_IDS[slug]) {
    // Fetch single property details
    const id = PROPERTY_IDS[slug]
    const [propRes, amenRes] = await Promise.all([
      fetch(`https://api.ownerrez.com/v2/properties/${id}`, { headers }),
      fetch(`https://api.ownerrez.com/v2/properties/${id}/amenities`, { headers }),
    ])
    const prop = await propRes.json()
    const amen = amenRes.ok ? await amenRes.json() : null
    return NextResponse.json({ property: prop, amenities: amen })
  }

  // Fetch all properties
  const results: Record<string, unknown> = {}
  for (const [s, id] of Object.entries(PROPERTY_IDS)) {
    const [propRes, amenRes] = await Promise.all([
      fetch(`https://api.ownerrez.com/v2/properties/${id}`, { headers }),
      fetch(`https://api.ownerrez.com/v2/properties/${id}/amenities`, { headers }),
    ])
    const prop = await propRes.json()
    const amen = amenRes.ok ? await amenRes.json() : null
    results[s] = { property: prop, amenities: amen }
  }
  return NextResponse.json(results)
}
