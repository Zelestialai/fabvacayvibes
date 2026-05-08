import { NextRequest, NextResponse } from 'next/server'

export async function GET(_request: NextRequest) {
  const email = process.env.OWNERREZ_EMAIL
  const token = process.env.OWNERREZ_TOKEN
  if (!email || !token) return NextResponse.json({ error: 'No credentials' }, { status: 500 })
  const creds = Buffer.from(`${email}:${token}`).toString('base64')
  const res = await fetch('https://api.ownerrez.com/v2/properties', {
    headers: { 'Authorization': `Basic ${creds}`, 'Content-Type': 'application/json', 'User-Agent': 'FabVacayVibes/1.0' }
  })
  const data = await res.json()
  return NextResponse.json(data.items?.map((p: {id: number, name: string, key?: string, abbreviation?: string}) => ({
    id: p.id, name: p.name, key: p.key, abbreviation: p.abbreviation
  })))
}
