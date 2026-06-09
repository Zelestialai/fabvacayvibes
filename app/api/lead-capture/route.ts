import { sendLeadEmail } from '../../lib/email'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, role, address, bedrooms, bathrooms, guests } = await request.json()

    // Send lead notification email via OwnerRez inquiry or direct mailto
    // For now, create an OwnerRez inquiry to capture the lead
    const OWNERREZ_EMAIL = process.env.OWNERREZ_EMAIL
    const OWNERREZ_TOKEN = process.env.OWNERREZ_TOKEN

    if (OWNERREZ_EMAIL && OWNERREZ_TOKEN) {
      const creds = Buffer.from(`${OWNERREZ_EMAIL}:${OWNERREZ_TOKEN}`).toString('base64')
      
      // Create guest in OwnerRez
      await fetch('https://app.ownerrez.com/api/guests', {
        method: 'POST',
        headers: { 'Authorization': `Basic ${creds}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          FirstName: name.split(' ')[0] || name,
          LastName: name.split(' ').slice(1).join(' ') || 'Lead',
          Email: email,
          Phone: phone || '',
          Notes: `Rent Analyzer Lead\nRole: ${role}\nProperty: ${address}\nBedrooms: ${bedrooms}, Bathrooms: ${bathrooms}, Guests: ${guests}`,
        }),
      })
    }

    // Log to console for Vercel logs
    console.log('New Rent Analyzer Lead:', { name, email, phone, role, address, bedrooms })
    try {
      await sendLeadEmail({ name, email, phone, role, address, bedrooms, bathrooms, guests })
    } catch (e) { console.error('Email error:', e) }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Lead capture error:', error)
    return NextResponse.json({ success: false })
  }
}
