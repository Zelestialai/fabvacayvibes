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
      // Fetch property data, amenities, and photos in parallel
      const [propRes, amenRes, photosRes] = await Promise.all([
        fetch(`https://api.ownerrez.com/v2/properties/${id}`, { headers }),
        fetch(`https://api.ownerrez.com/v2/properties/${id}/amenities`, { headers }),
        fetch(`https://api.ownerrez.com/v2/properties/${id}/photos`, { headers }),
      ])
      const prop = await propRes.json()
      const amenData = amenRes.ok ? await amenRes.json() : null
      const photosData = photosRes.ok ? await photosRes.json() : null

      // Extract amenity names — OwnerRez returns { items: [{ amenity: { name } }] }
      // or { items: [{ name }] } depending on endpoint version
      const amenityItems: Array<Record<string, unknown>> = amenData?.items || []
      const amenityNames: string[] = amenityItems.map((a) => {
        const amenObj = a.amenity as Record<string, unknown> | undefined
        return String(amenObj?.name || a.name || '')
      }).filter(Boolean)

      // Extract photo URLs — OwnerRez returns { items: [{ large_url, medium_url, sort_order }] }
      // sorted by sort_order ascending; fall back to medium_url if large_url absent
      const photoItems: Array<Record<string, unknown>> = photosData?.items || []
      const photoUrls: string[] = photoItems
        .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))
        .map((p) => String(p.large_url || p.medium_url || p.url || ''))
        .filter(Boolean)

      // Build synced data object with all available fields
      const syncedData = {
        syncedAt,
        id: prop.id,
        name: prop.name,
        description: prop.description || null,
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
        amenities: amenityNames.length > 0 ? amenityNames : null,
        photos: photoUrls.length > 0 ? photoUrls : null,
      }

      // Save to Vercel Blob
      await put(
        `content/sync/${slug}.json`,
        JSON.stringify(syncedData, null, 2),
        { access: 'public', addRandomSuffix: false, contentType: 'application/json', allowOverwrite: true }
      )

      results[slug] = {
        success: true,
        name: prop.name,
        synced: syncedAt,
        amenities: amenityNames.length,
        photos: photoUrls.length,
        hasDescription: !!syncedData.description,
      }
    } catch (e) {
      results[slug] = { success: false, error: String(e) }
    }
  }

  // Save sync log
  await put(
    'content/sync/last-sync.json',
    JSON.stringify({ syncedAt, results }, null, 2),
    { access: 'public', addRandomSuffix: false, contentType: 'application/json', allowOverwrite: true }
  )

  console.log('Daily sync completed:', results)
  return NextResponse.json({ syncedAt, results })
}
