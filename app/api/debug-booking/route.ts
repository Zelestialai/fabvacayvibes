import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const email = process.env.OWNERREZ_EMAIL
  const token = process.env.OWNERREZ_TOKEN
  if (!email || !token) return NextResponse.json({ error: 'No credentials' })

  const creds = Buffer.from(`${email}:${token}`).toString('base64')
  const headers = { 'Authorization': `Basic ${creds}`, 'Content-Type': 'application/json', 'User-Agent': 'FabVacayVibes/1.0' }

  const results: Record<string, unknown> = {}

  // Test 1: Create a guest
  const guestPayload = { FirstName: 'Test', LastName: 'User', Email: 'test@fabvacayvibes.com', Phone: '5555555555' }
  const guestRes = await fetch('https://app.ownerrez.com/api/guests', {
    method: 'POST', headers,
    body: JSON.stringify(guestPayload),
  })
  const guestText = await guestRes.text()
  results.guest_create = { status: guestRes.status, body: guestText.substring(0, 500) }

  // Test 2: Try searching for existing guest
  const searchRes = await fetch('https://api.ownerrez.com/v2/guests?email=test@fabvacayvibes.com', { headers })
  const searchText = await searchRes.text()
  results.guest_search = { status: searchRes.status, body: searchText.substring(0, 500) }

  // Test 3: Check what v2 endpoints are available
  const meRes = await fetch('https://api.ownerrez.com/v2/me', { headers })
  results.me = { status: meRes.status, body: await meRes.text().then(t => t.substring(0, 200)) }

  return NextResponse.json(results, { headers: { 'Cache-Control': 'no-store' } })
}
