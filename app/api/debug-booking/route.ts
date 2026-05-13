import { NextRequest, NextResponse } from 'next/server'

const LEGACY = 'https://app.ownerrez.com/api'

export async function GET(request: NextRequest) {
  const email = process.env.OWNERREZ_EMAIL
  const token = process.env.OWNERREZ_TOKEN
  if (!email || !token) return NextResponse.json({ error: 'No credentials' })

  const creds = Buffer.from(`${email}:${token}`).toString('base64')
  const headers = { 'Authorization': `Basic ${creds}`, 'Content-Type': 'application/json', 'User-Agent': 'FabVacayVibes/1.0' }

  const results: Record<string, unknown> = {}

  // Step 1: Create guest
  const guestRes = await fetch(`${LEGACY}/guests`, {
    method: 'POST', headers,
    body: JSON.stringify({ FirstName: 'Debug', LastName: 'Test', Email: 'debug@fabvacayvibes.com', Phone: '5555555555' }),
  })
  const guestText = await guestRes.text()
  const guestData = JSON.parse(guestText)
  results.guest = { status: guestRes.status, body: guestData }

  if (!guestRes.ok) return NextResponse.json(results)

  const guestId = guestData.Id || guestData.id
  results.guestId = guestId

  // Step 2: Create quote for Owl & Hare (next available dates)
  const quoteRes = await fetch(`${LEGACY}/quotes`, {
    method: 'POST', headers,
    body: JSON.stringify({
      GuestId: guestId,
      PropertyId: 452868,
      Arrival: '2026-07-01',
      Departure: '2026-07-03',
      Adults: 2, Children: 0, Pets: 0,
      SendQuoteEmail: false,
      RedirectAfterBookingUrl: 'https://fabvacayvibes.vercel.app/booking-confirmed',
    }),
  })
  const quoteText = await quoteRes.text()
  results.quote = { status: quoteRes.status, body: quoteText.substring(0, 2000) }

  // Try to parse and show payment URL
  try {
    const q = JSON.parse(quoteText)
    results.parsedQuote = {
      id: q.Id || q.id,
      allKeys: Object.keys(q),
      PaymentForm: q.PaymentForm,
      PaymentFormUrl: q.PaymentFormUrl,
      payment_form_url: q.payment_form_url,
    }
  } catch {}

  return NextResponse.json(results, { headers: { 'Cache-Control': 'no-store' } })
}
