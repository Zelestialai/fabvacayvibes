import { NextRequest, NextResponse } from 'next/server'
import { put, list } from '@vercel/blob'

export const maxDuration = 300

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-admin-secret')
  if (secret !== 'fabvacay-migrate-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { property, fileId, filename } = await request.json()
  if (!property || !fileId || !filename) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const blobPath = `images/${property}/${filename}`

  try {
    // Check if already uploaded
    const existing = await list({ prefix: blobPath })
    if (existing.blobs.length > 0) {
      return NextResponse.json({ url: existing.blobs[0].url, skipped: true })
    }

    // Download from Google Drive public URL
    const driveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`
    const imgRes = await fetch(driveUrl, { redirect: 'follow' })
    if (!imgRes.ok) throw new Error(`Drive fetch failed: ${imgRes.status}`)
    const imgBuffer = await imgRes.arrayBuffer()
    if (imgBuffer.byteLength < 1000) throw new Error(`File too small: ${imgBuffer.byteLength} bytes`)

    const blob = await put(blobPath, imgBuffer, {
      access: 'public',
      contentType: 'image/jpeg',
      addRandomSuffix: false,
    })

    return NextResponse.json({ url: blob.url, size: imgBuffer.byteLength })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const secret = request.headers.get('x-admin-secret')
  if (secret !== 'fabvacay-migrate-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const blobs = await list({ prefix: 'images/' })
  const byProp: Record<string, number> = {}
  for (const b of blobs.blobs) {
    const prop = b.pathname.split('/')[1]
    byProp[prop] = (byProp[prop] || 0) + 1
  }
  return NextResponse.json({ total: blobs.blobs.length, byProperty: byProp })
}
