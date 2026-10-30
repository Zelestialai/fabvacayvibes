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
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.5 },
    // Phase 6 destination landing pages
    { url: `${base}/joshua-tree-group-retreats`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${base}/joshua-tree-wellness-rentals`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${base}/large-group-vacation-rentals-california`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${base}/dog-friendly-joshua-tree`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${base}/vacation-rentals-near-yosemite`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${base}/clearwater-florida-vacation-rentals`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${base}/book-direct-vacation-rentals`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 },
  ]
}
