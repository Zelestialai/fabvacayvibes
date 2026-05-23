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

  const results: Record<string, unknown> = {}

  // Try various legacy API endpoints
  const endpoints = [
    `/properties/${id}`,
    `/properties/${id}/descriptions`,
    `/properties/${id}/listing`,
    `/properties/${id}/content`,
  ]

  for (const ep of endpoints) {
    const res = await fetch(`https://app.ownerrez.com/api${ep}`, { headers })
    const text = await res.text()
    try {
      results[ep] = { status: res.status, data: JSON.parse(text) }
    } catch {
      results[ep] = { status: res.status, raw: text.substring(0, 500) }
    }
  }

  return NextResponse.json(results)
}
