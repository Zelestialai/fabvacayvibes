'use client'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { trackPurchaseFromUrl } from '../lib/analytics'

/**
 * Fires GA4 + OpenAI Ads conversion events once on /booking-confirmed — only
 * when OwnerRez appends a booking_id to the redirect URL. A plain page load or
 * refresh without that param is a no-op, preventing duplicate conversion counting.
 *
 * Uses useSearchParams() rather than window.location.search because Next.js App
 * Router can rewrite the URL (stripping query params) during hydration before the
 * useEffect fires — useSearchParams reads from router state and is always correct.
 */
export default function BookingConfirmedAnalytics() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const bookingId = searchParams.get('booking_id')
    const amount = searchParams.get('amount')
    const currency = searchParams.get('currency') || 'USD'

    // GA4 purchase event
    trackPurchaseFromUrl(bookingId, amount, currency)

    // OpenAI Ads — order_created conversion event
    if (bookingId && typeof window !== 'undefined' && typeof (window as unknown as { oaiq?: Function }).oaiq === 'function') {
      const oaiq = (window as unknown as { oaiq: Function }).oaiq
      // amount from OwnerRez is in dollars (e.g. "1500.00").
      // OpenAI pixel requires minor units (cents), so multiply by 100.
      const amountMinorUnits = amount ? Math.round(parseFloat(amount) * 100) : undefined
      oaiq(
        'measure',
        'order_created',
        {
          type: 'contents',
          ...(amountMinorUnits !== undefined && !isNaN(amountMinorUnits)
            ? { amount: amountMinorUnits, currency }
            : {}),
        },
        { event_id: bookingId }
      )
    }
  // searchParams is stable across re-renders; this runs once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
