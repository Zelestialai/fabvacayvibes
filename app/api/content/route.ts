import { NextRequest, NextResponse } from 'next/server'
import { put, list } from '@vercel/blob'

const SECRET = 'fabvacay-admin-2026'
const SLUGS = ['casa-grande', 'owl-and-hare', 'sierra-crest-haven']

export async function GET(request: NextRequest) {
  if (request.headers.get('x-admin-secret') !== SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const descriptions: Record<string, string> = {}
  for (const slug of SLUGS) {
    try {
      const { blobs } = await list({ prefix: `content/descriptions/${slug}.txt` })
      if (blobs.length > 0) {
        const res = await fetch(blobs[0].url)
        descriptions[slug] = await res.text()
      }
    } catch {}
  }

  return NextResponse.json(descriptions)
}

export async function POST(request: NextRequest) {
  if (request.headers.get('x-admin-secret') !== SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug, description } = await request.json()
  if (!slug || !SLUGS.includes(slug)) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
  }

  await put(`content/descriptions/${slug}.txt`, description, {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'text/plain',
  })

  return NextResponse.json({ success: true, slug })
}
