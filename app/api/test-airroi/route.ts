import { NextResponse } from 'next/server'

export async function GET() {
  const AIRROI_KEY = process.env.AIRROI_API_KEY!

  // Correct params: lat/lng (not latitude/longitude), header: x-api-key
  const url = 'https://api.airroi.com/calculator/estimate?lat=27.9659&lng=-82.8001&bedrooms=3&baths=2&guests=6&currency=usd'
  const res = await fetch(url, { method: 'GET', headers: { 'x-api-key': AIRROI_KEY } })
  const body = await res.text()

  return NextResponse.json({ status: res.status, url, body: body.substring(0, 1000) })
}
