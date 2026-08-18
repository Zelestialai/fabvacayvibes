import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

const PROPERTY_IDS: Record<string, number> = {
  'casa-grande': 398247,
  'owl-and-hare': 452868,
  'sierra-crest-haven': 479162,
}

function isAuthorized(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const url = new URL(request.url)
  const querySecret = url.searchParams.get('secret')
  return authHeader === `Bearer ${process.env.CRON_SECRET}` ||
    request.headers.get('x-vercel-cron') === '1' ||
    querySecret === 'fabvacay-sync-2026'
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const email = process.env.OWNERREZ_EMAIL
  const token = process.env.OWNERREZ_TOKEN
  if (!email || !token) return NextResponse.json({ error: 'No OwnerRez credentials' }, { status: 500 })

  const creds = Buffer.from(`${email}:${token}`).toString('base64')
  const headers = { 'Authorization': `Basic ${creds}`, 'User-Agent': 'FabVacayVibes/1.0' }

  const results: Record<string, unknown> = {}
  const syncedAt = new Date().toISOString()

  for (const [slug, id] of Object.entries(PROPERTY_IDS)) {
    try {
      // Fetch latest property data from OwnerRez
      const propRes = await fetch(`https://api.ownerrez.com/v2/properties/${id}`, { headers })
      const prop = await propRes.json()

      // Build synced data object with all available fields
      const syncedData = {
        syncedAt,
        id: prop.id,
        name: prop.name,
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        bathrooms_full: prop.bathrooms_full,
        bathrooms_half: prop.bathrooms_half,
        max_guests: prop.max_guests,
        max_pets: prop.max_pets,
        living_area: prop.living_area,
        living_area_type: prop.living_area_type,
        check_in: prop.check_in,
        check_out: prop.check_out,
        address: prop.address,
        latitude: prop.latitude,
        longitude: prop.longitude,
        property_type: prop.property_type,
        listing_numbers: prop.listing_numbers,
        public_url: prop.public_url,
      }

      // Save to Vercel Blob
      await put(
        `content/sync/${slug}.json`,
        JSON.stringify(syncedData, null, 2),
        { access: 'public', addRandomSuffix: false, contentType: 'application/json' }
      )

      results[slug] = { success: true, name: prop.name, synced: syncedAt }
    } catch (e) {
      results[slug] = { success: false, error: String(e) }
    }
  }

  // Save sync log
  await put(
    'content/sync/last-sync.json',
    JSON.stringify({ syncedAt, results }, null, 2),
    { access: 'public', addRandomSuffix: false, contentType: 'application/json' }
  )

  console.log('Daily sync completed:', results)
  return NextResponse.json({ syncedAt, results })
}
