'use client'
import { useEffect } from 'react'
import { trackViewItem } from '../lib/analytics'

/**
 * Fires GA4 view_item once when a property detail page loads in the browser.
 * This is a client component so it can call useEffect.
 */
export default function PropertyAnalytics({
  propertySlug,
  propertyName,
  pricePerNight,
}: {
  propertySlug: string
  propertyName: string
  pricePerNight: number
}) {
  useEffect(() => {
    trackViewItem({ propertySlug, propertyName, pricePerNight })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // empty deps — fire once per page load

  return null // renders nothing
}
