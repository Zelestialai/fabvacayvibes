import { NextRequest, NextResponse } from 'next/server'

const V2 = 'https://api.ownerrez.com/v2'

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

// Temporary diagnostic endpoint — fetch surcharge list from OwnerRez
export async function GET(_request: NextRequest) {
  try {
    const creds = getCredentials()
    const r = await fetch(`${V2}/surcharges?property_ids=452868`, {
      headers: getHeaders(creds),
    })
    const text = await r.text()
    return new NextResponse(text, {
      status: r.status,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
