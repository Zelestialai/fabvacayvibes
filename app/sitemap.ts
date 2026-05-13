import { MetadataRoute } from 'next'
import { properties } from './lib/properties'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://fabvacayvibes.com'

  const propertyPages = properties.map(p => ({
    url: `${base}/properties/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/booking-confirmed`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    ...propertyPages,
  ]
}
