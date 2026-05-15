import { NextRequest, NextResponse } from 'next/server'
import { put, list } from '@vercel/blob'

export const maxDuration = 300

const ADMIN_SECRET = 'fabvacay-migrate-2026'

const DRIVE_FOLDERS: Record<string, string> = {
  'casa-grande':        '1vLoMo8LNySBI_DizwuBCrGeo9hj6HbjR',
  'owl-and-hare':       '1qjSJGYgQvCCIAn55CHV1mLwsmu965HMw',
  'sierra-crest-haven': '1Ksl1jlsXK1AR25BsZKJ60xhEiTZMwaDB',
}

async function getDriveFiles(folderId: string, apiKey: string) {
  const allFiles: { id: string; name: string }[] = []
  let pageToken: string | undefined

  do {
    const params = new URLSearchParams({
      q: `'${folderId}' in parents and mimeType contains 'image/' and trashed=false`,
      fields: 'nextPageToken,files(id,name)',
      pageSize: '1000',
      key: apiKey,
    })
    if (pageToken) params.set('pageToken', pageToken)

    const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`)
    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Drive API error ${res.status}: ${err.substring(0, 200)}`)
    }
    const data = await res.json()
    allFiles.push(...(data.files || []))
    pageToken = data.nextPageToken
  } while (pageToken)

  return allFiles
}

export async function POST(request: NextRequest) {
  if (request.headers.get('x-admin-secret') !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.GOOGLE_API_KEY
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN

  if (!apiKey) return NextResponse.json({ error: 'GOOGLE_API_KEY not set in Vercel env vars' }, { status: 500 })
  if (!blobToken) return NextResponse.json({ error: 'BLOB_READ_WRITE_TOKEN not set in Vercel env vars' }, { status: 500 })

  const { property, batchSize = 10 } = await request.json()
  const folderId = DRIVE_FOLDERS[property]
  if (!folderId) return NextResponse.json({ error: 'Unknown property' }, { status: 400 })

  // Get already uploaded blobs
  const existing = await list({ prefix: `images/${property}/` })
  const existingNames = new Set(existing.blobs.map(b => decodeURIComponent(b.pathname.split('/').slice(2).join('/'))))

  // Get all Drive files
  let driveFiles: { id: string; name: string }[]
  try {
    driveFiles = await getDriveFiles(folderId, apiKey)
  } catch (e) {
    return NextResponse.json({ error: `Drive listing failed: ${e}` }, { status: 500 })
  }

  const pending = driveFiles.filter(f => !existingNames.has(f.name))
  const batch = pending.slice(0, batchSize)

  const results = []
  for (const file of batch) {
    try {
      // Download from Drive
      const driveUrl = `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media&key=${apiKey}`
      const imgRes = await fetch(driveUrl)

      if (!imgRes.ok) {
        const errText = await imgRes.text()
        results.push({ name: file.name, ok: false, error: `Drive download ${imgRes.status}: ${errText.substring(0, 100)}` })
        continue
      }

      const buffer = await imgRes.arrayBuffer()
      if (buffer.byteLength < 1000) {
        results.push({ name: file.name, ok: false, error: `Too small: ${buffer.byteLength} bytes - check Drive sharing` })
        continue
      }

      // Upload to Blob
      const blob = await put(`images/${property}/${file.name}`, buffer, {
        access: 'public',
        contentType: imgRes.headers.get('content-type') || 'image/jpeg',
        addRandomSuffix: false,
      })

      results.push({ name: file.name, ok: true, url: blob.url, size: buffer.byteLength })
    } catch (e) {
      results.push({ name: file.name, ok: false, error: String(e) })
    }
  }

  const succeeded = results.filter(r => r.ok).length
  const failed = results.filter(r => !r.ok)

  return NextResponse.json({
    property,
    totalInDrive: driveFiles.length,
    alreadyUploaded: existingNames.size,
    pendingCount: pending.length,
    batchProcessed: batch.length,
    succeeded,
    remaining: Math.max(0, pending.length - succeeded),
    failures: failed,
  })
}

export async function GET(request: NextRequest) {
  if (request.headers.get('x-admin-secret') !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const envCheck = {
    GOOGLE_API_KEY: !!process.env.GOOGLE_API_KEY,
    BLOB_READ_WRITE_TOKEN: !!process.env.BLOB_READ_WRITE_TOKEN,
  }

  const summary: Record<string, number> = {}
  for (const prop of Object.keys(DRIVE_FOLDERS)) {
    const blobs = await list({ prefix: `images/${prop}/` })
    summary[prop] = blobs.blobs.length
  }

  return NextResponse.json({ envVars: envCheck, uploaded: summary })
}
