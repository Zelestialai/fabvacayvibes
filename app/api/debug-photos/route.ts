import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  if (url.searchParams.get('secret') !== 'fabvacay-sync-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const email = process.env.OWNERREZ_EMAIL
  const token = process.env.OWNERREZ_TOKEN
  if (!email || !token) return NextResponse.json({ error: 'No creds' }, { status: 500 })

  const creds = Buffer.from(`${email}:${token}`).toString('base64')
  const headers = { 'Authorization': `Basic ${creds}`, 'User-Agent': 'FabVacayVibes/1.0' }

  // Test broadleaf photos endpoint
  const id = 494513
  const photosRes = await fetch(`https://api.ownerrez.com/v2/properties/${id}/photos`, { headers })
  const photosText = await photosRes.text()

  // Also try the listings/photos approach
  const listingRes = await fetch(`https://api.ownerrez.com/v2/listings?property_id=${id}`, { headers })
  const listingText = await listingRes.text()

  return NextResponse.json({
    photosStatus: photosRes.status,
    photosRaw: photosText.substring(0, 2000),
    listingStatus: listingRes.status,
    listingRaw: listingText.substring(0, 2000),
  })
}
