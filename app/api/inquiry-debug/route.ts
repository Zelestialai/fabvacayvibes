import { NextRequest, NextResponse } from 'next/server'

const LEGACY = 'https://app.ownerrez.com/api'

export async function POST(request: NextRequest) {
  // Only allow with admin secret
  const secret = request.headers.get('x-admin-secret')
  if (secret !== 'fabvacay-admin-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const emailVal = process.env.OWNERREZ_EMAIL
  const token = process.env.OWNERREZ_TOKEN
  if (!emailVal || !token) return NextResponse.json({ error: 'No credentials' }, { status: 500 })

  const creds = Buffer.from(`${emailVal}:${token}`).toString('base64')
  const headers = {
    'Authorization': `Basic ${creds}`,
    'Content-Type': 'application/json',
    'User-Agent': 'FabVacayVibes/1.0',
  }

  // Step 1: Create a test guest
  const guestPayload = {
    FirstName: 'Test',
    LastName: 'Guest',
    Email: 'test-debug@fabvacayvibes.com',
    Phone: '5555550000',
  }

  const guestRes = await fetch(`${LEGACY}/guests`, {
    method: 'POST', headers,
    body: JSON.stringify(guestPayload),
  })
  const guestStatus = guestRes.status
  const guestText = await guestRes.text()
  let guestData: Record<string, unknown> = {}
  try { guestData = JSON.parse(guestText) } catch {}

  const guestId = guestData.Id || guestData.id || null

  // Step 2: If we got a guestId, fetch the guest back to see what's stored
  let fetchedGuest: Record<string, unknown> = {}
  if (guestId) {
    const fetchRes = await fetch(`${LEGACY}/guests/${guestId}`, { headers })
    try { fetchedGuest = await fetchRes.json() } catch {}
  }

  // Step 3: Create a test quote linked to that guest
  let quoteStatus = 0
  let quoteText = ''
  let quoteData: Record<string, unknown> = {}
  if (guestId) {
    const quotePayload = {
      GuestId: guestId,
      PropertyId: 398247, // Casa Grande
      Adults: 2,
      Children: 0,
      Pets: 0,
      SendQuoteEmail: false,
      Comments: 'DEBUG TEST — please delete',
      Arrival: '2027-01-10',
      Departure: '2027-01-15',
    }
    const qRes = await fetch(`${LEGACY}/quotes`, {
      method: 'POST', headers,
      body: JSON.stringify(quotePayload),
    })
    quoteStatus = qRes.status
    quoteText = await qRes.text()
    try { quoteData = JSON.parse(quoteText) } catch {}
  }

  return NextResponse.json({
    step1_guest_create: {
      status: guestStatus,
      payload: guestPayload,
      response: guestData,
      rawPreview: guestText.substring(0, 500),
    },
    step2_guest_fetch: {
      guestId,
      fetched: fetchedGuest,
    },
    step3_quote_create: {
      status: quoteStatus,
      response: quoteData,
      rawPreview: quoteText.substring(0, 500),
    },
  })
}
