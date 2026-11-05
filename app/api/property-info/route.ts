import { NextRequest, NextResponse } from 'next/server'

const V2 = 'https://api.ownerrez.com/v2'
const LEGACY = 'https://app.ownerrez.com/api'

function getCredentials() {
  const email = process.env.OWNERREZ_EMAIL
  const token = process.env.OWNERREZ_TOKEN
  if (!email || !token) throw new Error('API credentials not configured')
  return Buffer.from(`${email}:${token}`).toString('base64')
}

const getHeaders = (creds: string) => ({
  'Authorization': `Basic ${creds}`,
  'Content-Type': 'application/json',
  'User-Agent': 'FabVacayVibes/1.0',
})

// Temporary diagnostic — fetch all details for a property by numeric ID
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const propertyId = searchParams.get('id')
  if (!propertyId) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  try {
    const creds = getCredentials()
    const h = getHeaders(creds)

    const [propRes, amenRes, photoRes, surchargeRes, rateRes] = await Promise.all([
      fetch(`${V2}/properties/${propertyId}`, { headers: h }),
      fetch(`${V2}/properties/${propertyId}/amenities`, { headers: h }),
      fetch(`${V2}/properties/${propertyId}/photos`, { headers: h }),
      fetch(`${V2}/surcharges?property_ids=${propertyId}`, { headers: h }),
      fetch(`${LEGACY}/propertysettings/${propertyId}`, { headers: h }),
    ])

    const [prop, amen, photos, surcharges, rates] = await Promise.all([
      propRes.ok ? propRes.json() : propRes.text(),
      amenRes.ok ? amenRes.json() : amenRes.text(),
      photoRes.ok ? photoRes.json() : photoRes.text(),
      surchargeRes.ok ? surchargeRes.json() : surchargeRes.text(),
      rateRes.ok ? rateRes.json() : rateRes.text(),
    ])

    return NextResponse.json({ prop, amen, photos, surcharges, rates }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
