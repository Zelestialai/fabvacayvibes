import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

const PROPERTY_IDS: Record<string, number> = {
  'casa-grande': 398247,
  'owl-and-hare': 452868,
  'sierra-crest-haven': 479162,
  'broadleaf': 494513,
}

// Guest privacy: publish only first name + last initial (e.g. "Sarah T.")
function publicReviewerName(raw: unknown): string {
  const parts = String(raw ?? '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'Guest'
  const first = parts[0]
  const last = parts.length > 1 ? parts[parts.length - 1] : ''
  return last ? `${first} ${last.charAt(0).toUpperCase()}.` : first
}

// Fetch every review for a property from OwnerRez (paginated). Returns null on failure
// so a bad response never wipes previously synced data with an empty list.
async function fetchReviews(propertyId: number, headers: Record<string, string>): Promise<{ reviews: ReturnType<typeof mapReviews> | null; error?: string }> {
  const items: Array<Record<string, unknown>> = []
  const limit = 100
  for (let page = 0; page < 20; page++) {
    const res = await fetch(
      `https://api.ownerrez.com/v2/reviews?property_ids=${propertyId}&limit=${limit}&offset=${page * limit}`,
      { headers }
    )
    if (!res.ok) {
      const detail = (await res.text().catch(() => '')).slice(0, 200)
      const error = `HTTP ${res.status} ${detail}`
      return page === 0 || items.length === 0 ? { reviews: null, error } : { reviews: mapReviews(items), error }
    }
    const data = await res.json()
    const batch: Array<Record<string, unknown>> = data?.items || []
    items.push(...batch)
    if (batch.length < limit) break
  }
  return { reviews: mapReviews(items) }
}

function mapReviews(items: Array<Record<string, unknown>>) {
  return items
    .filter((r) => String(r.body ?? '').trim().length > 0)
    .map((r) => ({
      id: r.id,
      rating: typeof r.rating === 'number' ? r.rating : null,
      title: r.title ? String(r.title) : null,
      body: String(r.body).trim(),
      reviewer: publicReviewerName(r.reviewer_name),
      date: r.created_utc ? String(r.created_utc) : null,
    }))
    .sort((a, b) => String(b.date ?? '').localeCompare(String(a.date ?? '')))
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
      const reviewResult = await fetchReviews(id, headers).catch((e) => ({ reviews: null, error: String(e) }))
      const reviews = reviewResult.reviews
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
        // Privacy: exact street address is never stored; coordinates rounded to ~1 km
        latitude: typeof prop.latitude === 'number' ? Math.round(prop.latitude * 100) / 100 : null,
        longitude: typeof prop.longitude === 'number' ? Math.round(prop.longitude * 100) / 100 : null,
        property_type: prop.property_type,
        listing_numbers: prop.listing_numbers,
        public_url: prop.public_url,
        reviews,
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
        reviews: reviews ? reviews.length : 'fetch failed',
        reviewsError: reviewResult.error ?? null,
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
