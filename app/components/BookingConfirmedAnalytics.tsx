'use client'
import { useEffect } from 'react'
import { trackPurchaseFromUrl } from '../lib/analytics'

/**
 * Fires GA4 purchase event once on /booking-confirmed — only when OwnerRez
 * appends a booking_id to the redirect URL. A plain page load or refresh
 * without that param is a no-op, preventing duplicate conversion counting.
 */
export default function BookingConfirmedAnalytics() {
  useEffect(() => {
    trackPurchaseFromUrl()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
