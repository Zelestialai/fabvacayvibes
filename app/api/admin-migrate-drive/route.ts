import { NextRequest, NextResponse } from 'next/server'
import { put, list } from '@vercel/blob'

export const maxDuration = 300

const ADMIN_SECRET = 'fabvacay-migrate-2026'

const DRIVE_FOLDERS: Record<string, { folderId: string; slug: string }> = {
  'casa-grande':        { folderId: '1vLoMo8LNySBI_DizwuBCrGeo9hj6HbjR', slug: 'casa-grande' },
  'owl-and-hare':       { folderId: '1qjSJGYgQvCCIAn55CHV1mLwsmu965HMw', slug: 'owl-and-hare' },
  'sierra-crest-haven': { folderId: '1Ksl1jlsXK1AR25BsZKJ60xhEiTZMwaDB', slug: 'sierra-crest-haven' },
}

async function getDriveFiles(folderId: string, apiKey: string, pageToken?: string) {
  const params = new URLSearchParams({
    q: `'${folderId}' in parents and mimeType contains 'image/' and trashed=false`,
    fields: 'nextPageToken,files(id,name,mimeType)',
    pageSize: '100',
    key: apiKey,
  })
  if (pageToken) params.set('pageToken', pageToken)
  
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`)
  return res.json()
}

async function downloadDriveFile(fileId: string, apiKey: string) {
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`,
    { redirect: 'follow' }
  )
  if (!res.ok) throw new Error(`Drive download failed: ${res.status}`)
  return res.arrayBuffer()
}

export async function POST(request: NextRequest) {
  if (request.headers.get('x-admin-secret') !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { property, batchSize = 5 } = await request.json()
  const apiKey = process.env.GOOGLE_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'GOOGLE_API_KEY not set' }, { status: 500 })

  const propConfig = DRIVE_FOLDERS[property]
  if (!propConfig) return NextResponse.json({ error: 'Unknown property' }, { status: 400 })

  // List files already in blob
  const existing = await list({ prefix: `images/${property}/` })
  const existingNames = new Set(existing.blobs.map(b => b.pathname.split('/').pop()))

  // Get files from Drive
  const driveData = await getDriveFiles(propConfig.folderId, apiKey)
  const allFiles: { id: string; name: string }[] = driveData.files || []
  
  // Filter to ones not yet uploaded
  const pending = allFiles.filter(f => !existingNames.has(f.name))
  const batch = pending.slice(0, batchSize)

  const results = []
  for (const file of batch) {
    try {
      const buffer = await downloadDriveFile(file.id, apiKey)
      const blob = await put(`images/${property}/${file.name}`, buffer, {
        access: 'public',
        contentType: 'image/jpeg',
        addRandomSuffix: false,
      })
      results.push({ name: file.name, url: blob.url, ok: true })
    } catch (e) {
      results.push({ name: file.name, error: String(e), ok: false })
    }
  }

  return NextResponse.json({
    property,
    totalInDrive: allFiles.length,
    alreadyUploaded: existingNames.size,
    pendingCount: pending.length,
    batchProcessed: results.length,
    remaining: Math.max(0, pending.length - results.length),
    results,
  })
}

export async function GET(request: NextRequest) {
  if (request.headers.get('x-admin-secret') !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const summary: Record<string, number> = {}
  for (const prop of Object.keys(DRIVE_FOLDERS)) {
    const blobs = await list({ prefix: `images/${prop}/` })
    summary[prop] = blobs.blobs.length
  }
  return NextResponse.json({ uploaded: summary })
}
