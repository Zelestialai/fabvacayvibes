import { NextResponse } from 'next/server'

export async function GET() {
  const AIRROI_KEY = process.env.AIRROI_API_KEY!

  const results: Record<string, unknown> = {}

  // Test 1: GET with query params (current approach)
  const url1 = 'https://api.airroi.com/calculator/estimate?latitude=27.9659&longitude=-82.8001&bedrooms=3&baths=2&guests=6&currency=usd'
  const r1 = await fetch(url1, { method: 'GET', headers: { 'X-API-KEY': AIRROI_KEY } })
  results['GET_queryparams'] = { status: r1.status, body: await r1.text() }

  // Test 2: POST with JSON body
  const r2 = await fetch('https://api.airroi.com/calculator/estimate', {
    method: 'POST',
    headers: { 'X-API-KEY': AIRROI_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ latitude: 27.9659, longitude: -82.8001, bedrooms: 3, baths: 2, guests: 6, currency: 'usd' })
  })
  results['POST_json'] = { status: r2.status, body: await r2.text() }

  // Test 3: GET with address string
  const url3 = 'https://api.airroi.com/calculator/estimate?address=Clearwater,FL&bedrooms=3&baths=2&guests=6&currency=usd'
  const r3 = await fetch(url3, { method: 'GET', headers: { 'X-API-KEY': AIRROI_KEY } })
  results['GET_address'] = { status: r3.status, body: await r3.text() }

  // Test 4: POST with address
  const r4 = await fetch('https://api.airroi.com/calculator/estimate', {
    method: 'POST',
    headers: { 'X-API-KEY': AIRROI_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ address: 'Clearwater, FL', bedrooms: 3, baths: 2, guests: 6, currency: 'usd' })
  })
  results['POST_address'] = { status: r4.status, body: await r4.text() }

  return NextResponse.json(results)
}
