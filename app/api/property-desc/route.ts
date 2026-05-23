import { NextRequest, NextResponse } from 'next/server'

const PROPERTY_KEYS: Record<string, string> = {
  'casa-grande': 'orp5b613a7x',
  'owl-and-hare': 'orp5b6e904x',
  'sierra-crest-haven': 'orp5b74fbax',
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug') || 'casa-grande'
  const key = PROPERTY_KEYS[slug]

  const email = process.env.OWNERREZ_EMAIL
  const token = process.env.OWNERREZ_TOKEN
  const creds = Buffer.from(`${email}:${token}`).toString('base64')
  const headers = { 'Authorization': `Basic ${creds}`, 'User-Agent': 'FabVacayVibes/1.0' }

  const results: Record<string, unknown> = {}

  // Try the channel XML feed which has full listing content
  const xmlEndpoints = [
    `https://app.ownerrez.com/feeds/property/${key}`,
    `https://app.ownerrez.com/feeds/property/${key}/listing`,
    `https://app.ownerrez.com/feeds/listing/${key}`,
    `https://app.ownerrez.com/api/channel/listing/${key}`,
    `https://api.ownerrez.com/v2/properties?key=${key}&fields=description,summary,headline`,
  ]

  for (const url of xmlEndpoints) {
    try {
      const res = await fetch(url, { headers })
      const text = await res.text()
      results[url] = { status: res.status, preview: text.substring(0, 300) }
    } catch (e) {
      results[url] = { error: String(e) }
    }
  }

  return NextResponse.json(results)
}
