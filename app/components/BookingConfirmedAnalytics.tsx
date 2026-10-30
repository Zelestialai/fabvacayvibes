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

    // OpenAI Ads — order_created conversion event (fires only when OwnerRez provides booking_id)
    if (typeof window !== 'undefined' && typeof (window as unknown as { oaiq?: Function }).oaiq === 'function') {
      const oaiq = (window as unknown as { oaiq: Function }).oaiq
      const params = new URLSearchParams(window.location.search)
      const bookingId = params.get('booking_id')
      const amount = params.get('amount')
      const currency = params.get('currency') || 'USD'
      if (bookingId) {
        oaiq(
          'measure',
          'order_created',
          { type: 'contents', amount: amount ? parseFloat(amount) : undefined, currency },
          { event_id: bookingId }
        )
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
