import { MetadataRoute } from 'next'
import { properties } from './lib/properties'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://fabvacayvibes.com'
  const now = new Date()

  const propertyPages = properties.map(p => ({
    url: `${base}/properties/${p.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  return [
    { url: base, lastModified: now, changeFrequency: 'daily' as const, priority: 1.0 },
    { url: `${base}/services`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${base}/rent-analyzer`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 },
    ...propertyPages,
    { url: `${base}/booking-confirmed`, lastModified: now, changeFrequency: 'yearly' as const, priority: 0.2 },
  ]
}
