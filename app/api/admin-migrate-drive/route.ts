import { NextRequest, NextResponse } from 'next/server'
import { put, list } from '@vercel/blob'

export const maxDuration = 300

const ADMIN_SECRET = 'fabvacay-migrate-2026'

const DRIVE_FOLDERS: Record<string, string> = {
  'casa-grande':        '1vLoMo8LNySBI_DizwuBCrGeo9hj6HbjR',
  'owl-and-hare':       '1qjSJGYgQvCCIAn55CHV1mLwsmu965HMw',
  'sierra-crest-haven': '1uFcueCUWEAmE6TPb-hxbXvDIrQChXHrw',
}

interface DriveFile { id: string; name: string; blobPath: string }

async function getDriveFilesRecursive(folderId: string, apiKey: string, pathPrefix: string): Promise<DriveFile[]> {
  const allFiles: DriveFile[] = []
  let pageToken: string | undefined

  do {
    const params = new URLSearchParams({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'nextPageToken,files(id,name,mimeType)',
      pageSize: '1000',
      key: apiKey,
    })
    if (pageToken) params.set('pageToken', pageToken)

    const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`)
    if (!res.ok) throw new Error(`Drive API ${res.status}: ${await res.text().then(t=>t.substring(0,200))}`)
    const data = await res.json()

    for (const file of (data.files || [])) {
      if (file.mimeType === 'application/vnd.google-apps.folder') {
        // Recurse into subfolder
        const subPath = pathPrefix ? `${pathPrefix}/${file.name}` : file.name
        const subFiles = await getDriveFilesRecursive(file.id, apiKey, subPath)
        allFiles.push(...subFiles)
      } else if (file.mimeType.startsWith('image/')) {
        const blobPath = pathPrefix ? `${pathPrefix}/${file.name}` : file.name
        allFiles.push({ id: file.id, name: file.name, blobPath })
      }
    }
    pageToken = data.nextPageToken
  } while (pageToken)

  return allFiles
}

export async function POST(request: NextRequest) {
  if (request.headers.get('x-admin-secret') !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.GOOGLE_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'GOOGLE_API_KEY not set' }, { status: 500 })

  const { property, batchSize = 10 } = await request.json()
  const folderId = DRIVE_FOLDERS[property]
  if (!folderId) return NextResponse.json({ error: 'Unknown property' }, { status: 400 })

  const existing = await list({ prefix: `images/${property}/` })
  const existingPaths = new Set(existing.blobs.map(b =>
    decodeURIComponent(b.pathname.replace(`images/${property}/`, ''))
  ))

  let driveFiles: DriveFile[]
  try {
    driveFiles = await getDriveFilesRecursive(folderId, apiKey, '')
  } catch (e) {
    return NextResponse.json({ error: `Drive listing failed: ${e}` }, { status: 500 })
  }

  const pending = driveFiles.filter(f => !existingPaths.has(f.blobPath))
  const batch = pending.slice(0, batchSize)

  const results = []
  for (const file of batch) {
    try {
      let buffer: ArrayBuffer | null = null

      const r1 = await fetch(`https://www.googleapis.com/drive/v3/files/${file.id}?alt=media&key=${apiKey}`)
      if (r1.ok) { const c = await r1.arrayBuffer(); if (c.byteLength > 1000) buffer = c }

      if (!buffer) {
        const r2 = await fetch(`https://drive.google.com/uc?export=download&id=${file.id}&confirm=t`, { redirect: 'follow' })
        if (r2.ok) { const c = await r2.arrayBuffer(); if (c.byteLength > 1000) buffer = c }
      }

      if (!buffer) { results.push({ name: file.blobPath, ok: false, error: 'Download failed' }); continue }

      const blob = await put(`images/${property}/${file.blobPath}`, buffer, {
        access: 'public',
        contentType: 'image/jpeg',
        addRandomSuffix: false,
      })
      results.push({ name: file.blobPath, ok: true, url: blob.url })
    } catch (e) {
      results.push({ name: file.blobPath, ok: false, error: String(e) })
    }
  }

  const succeeded = results.filter(r => r.ok).length
  return NextResponse.json({
    property,
    totalInDrive: driveFiles.length,
    alreadyUploaded: existingPaths.size,
    pendingCount: pending.length,
    batchProcessed: batch.length,
    succeeded,
    remaining: Math.max(0, pending.length - succeeded),
    failures: results.filter(r => !r.ok),
  })
}

export async function GET(request: NextRequest) {
  if (request.headers.get('x-admin-secret') !== ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const apiKey = !!process.env.GOOGLE_API_KEY
  const blobToken = !!process.env.BLOB_READ_WRITE_TOKEN
  const summary: Record<string, number> = {}
  for (const prop of Object.keys(DRIVE_FOLDERS)) {
    const blobs = await list({ prefix: `images/${prop}/` })
    summary[prop] = blobs.blobs.length
  }
  return NextResponse.json({ envVars: { GOOGLE_API_KEY: apiKey, BLOB_READ_WRITE_TOKEN: blobToken }, uploaded: summary })
}
