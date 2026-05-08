import { NextRequest, NextResponse } from 'next/server'

const PROPERTY_EXTERNAL_IDS: Record<string, string> = {
  'casa-grande':        'orp5b613a7x',
  'owl-and-hare':       'orp5b6e904x',
  'sierra-crest-haven': 'orp5b74fbax',
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('property')

  if (!slug || !PROPERTY_EXTERNAL_IDS[slug]) {
    return NextResponse.json({ error: 'Invalid property' }, { status: 400 })
  }

  const email = process.env.OWNERREZ_EMAIL
  const token = process.env.OWNERREZ_TOKEN
  if (!email || !token) return NextResponse.json({ error: 'No credentials' }, { status: 500 })

  const externalId = PROPERTY_EXTERNAL_IDS[slug]
  const creds = Buffer.from(`${email}:${token}`).toString('base64')

  // Try OwnerRez XML feed which contains full photo list
  const res = await fetch(
    `https://app.ownerrez.com/feeds/property?externalId=${externalId}&include=photos`,
    {
      headers: {
        'Authorization': `Basic ${creds}`,
        'User-Agent': 'FabVacayVibes/1.0',
      }
    }
  )

  const text = await res.text()
  console.log('Feed status:', res.status, text.substring(0, 300))

  if (!res.ok) {
    return NextResponse.json({ error: `Feed failed: ${res.status}`, details: text.substring(0, 300) }, { status: 500 })
  }

  // Extract image URLs from XML
  const imageMatches = text.matchAll(/<image[^>]*>([^<]+)<\/image>|<url[^>]*>([^<]+orez\.io[^<]+)<\/url>|https:\/\/uc\.orez\.io\/i\/[a-f0-9-]+-\w+/gi)
  const urls: string[] = []
  for (const match of imageMatches) {
    const url = match[1] || match[2] || match[0]
    if (url && url.includes('orez.io') && !urls.includes(url)) {
      urls.push(url.trim())
    }
  }

  return NextResponse.json({ propertySlug: slug, photoUrls: urls, rawXml: text.substring(0, 2000) })
}
