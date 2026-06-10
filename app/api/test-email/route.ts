import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function GET() {
  const key = process.env.RESEND_API_KEY
  if (!key) return NextResponse.json({ error: 'RESEND_API_KEY not set in Vercel env vars' })

  try {
    const resend = new Resend(key)
    const result = await resend.emails.send({
      from: 'Fab Vacay Vibes <noreply@fabvacayvibes.com>',
      to: 'FabVacayVibes@gmail.com',
      subject: 'Test Email from Fab Vacay Vibes',
      html: '<p>This is a test email. If you see this, Resend is working!</p>',
    })
    return NextResponse.json({ success: true, result, keyPrefix: key.substring(0, 10) })
  } catch (e) {
    return NextResponse.json({ error: String(e) })
  }
}
