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

  // Try all known OwnerRez v2 sub-resources
  const v2Endpoints = [
    `/properties/${id}`,
    `/properties/${id}/photos`,
    `/properties/${id}/amenities`,
    `/properties/${id}/rates`,
    `/properties/${id}/surcharges`,
    `/properties/${id}/taxes`,
    `/properties/${id}/seasons`,
    `/properties/${id}/availability`,
    `/properties/${id}/checkinmethods`,
    `/properties/${id}/rulesandpolicies`,
    `/listings`,
  ]

  for (const ep of v2Endpoints) {
    const res = await fetch(`https://api.ownerrez.com/v2${ep}`, { headers })
    if (res.ok) {
      const data = await res.json()
      // Only show if has description-like fields
      const str = JSON.stringify(data)
      if (str.includes('description') || str.includes('summary') || str.includes('headline') || str.includes('name')) {
        results[`v2${ep}`] = data
      } else {
        results[`v2${ep}`] = `OK but no description fields. Keys: ${Object.keys(data).join(', ')}`
      }
    } else {
      results[`v2${ep}`] = `${res.status}`
    }
  }

  return NextResponse.json(results)
}
