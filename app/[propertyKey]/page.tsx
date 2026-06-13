import { redirect } from 'next/navigation'
import { properties } from '../lib/properties'

const KEY_TO_SLUG: Record<string, string> = {
  'orp5b613a7x': 'casa-grande',
  'orp5b6e904x': 'owl-and-hare',
  'orp5b74fbax': 'sierra-crest-haven',
}

export default async function PropertyKeyRedirect({
  params,
  searchParams,
}: {
  params: Promise<{ propertyKey: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { propertyKey } = await params
  const search = await searchParams

  const slug = KEY_TO_SLUG[propertyKey]
  if (!slug || !properties.find(p => p.slug === slug)) {
    redirect('/')
  }

  // Map OwnerRez query params to our booking flow params
  const qp = new URLSearchParams()
  if (search.or_arrival) qp.set('arrival', String(search.or_arrival))
  if (search.or_departure) qp.set('departure', String(search.or_departure))
  if (search.or_adults) qp.set('adults', String(search.or_adults))
  if (search.or_children) qp.set('children', String(search.or_children))

  const query = qp.toString()
  redirect(`/properties/${slug}${query ? `?${query}` : ''}`)
}
