import { NextRequest, NextResponse } from 'next/server'

const PROPERTY_IDS: Record<string, number> = {
  'casa-grande': 398247,
  'owl-and-hare': 452868,
  'sierra-crest-haven': 479162,
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug') || 'casa-grande'
  const id = PROPERTY_IDS[slug]

  const email = process.env.OWNERREZ_EMAIL
  const token = process.env.OWNERREZ_TOKEN
  const creds = Buffer.from(`${email}:${token}`).toString('base64')
  const headers = { 'Authorization': `Basic ${creds}`, 'User-Agent': 'FabVacayVibes/1.0' }

  // Try multiple endpoints to find descriptions
  const [descRes, fieldRes] = await Promise.all([
    fetch(`https://api.ownerrez.com/v2/properties/${id}/descriptions`, { headers }),
    fetch(`https://api.ownerrez.com/v2/properties/${id}/fields`, { headers }),
  ])

  const desc = descRes.ok ? await descRes.json() : { status: descRes.status }
  const fields = fieldRes.ok ? await fieldRes.json() : { status: fieldRes.status }

  return NextResponse.json({ slug, id, descriptions: desc, fields })
}
