import { NextResponse } from 'next/server'

export async function GET() {
  const AIRROI_KEY = process.env.AIRROI_API_KEY

  // Test with hardcoded Clearwater, FL coords
  const url = new URL('https://api.airroi.com/calculator/estimate')
  url.searchParams.set('latitude', '27.9659')
  url.searchParams.set('longitude', '-82.8001')
  url.searchParams.set('bedrooms', '3')
  url.searchParams.set('baths', '2')
  url.searchParams.set('guests', '6')
  url.searchParams.set('currency', 'usd')

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: { 'X-API-KEY': AIRROI_KEY! },
  })

  const text = await res.text()
  return NextResponse.json({ status: res.status, url: url.toString(), response: text.substring(0, 1000) })
}
