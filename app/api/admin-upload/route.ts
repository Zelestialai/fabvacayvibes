import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

export const maxDuration = 60

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-admin-secret')
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { imageUrl, blobPath } = body

  if (!imageUrl || !blobPath) {
    return NextResponse.json({ error: 'Missing imageUrl or blobPath' }, { status: 400 })
  }

  try {
    // Fetch the image from Google Drive or any URL
    const imgRes = await fetch(imageUrl)
    if (!imgRes.ok) throw new Error(`Failed to fetch image: ${imgRes.status}`)
    
    const imgBuffer = await imgRes.arrayBuffer()
    
    const blob = await put(blobPath, imgBuffer, {
      access: 'public',
      contentType: 'image/jpeg',
      addRandomSuffix: false,
    })

    return NextResponse.json({ url: blob.url, path: blobPath })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
