'use client'
import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { trackPurchaseFromUrl, consumePendingBooking } from '../lib/analytics'

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
    // Always consume the saved booking so it can't fire on a later visit.
    const pending = consumePendingBooking()

    // Prefer details OwnerRez puts in the URL; otherwise fall back to the
    // booking saved just before the guest was sent to the payment page.
    const bookingId =
      searchParams.get('booking_id') || (pending ? `quote-${pending.quoteId}` : null)
    const amount =
      searchParams.get('amount') ||
      (pending?.total !== undefined ? String(pending.total) : null)
    const currency = searchParams.get('currency') || 'USD'

    // GA4 + Meta Pixel purchase events
    trackPurchaseFromUrl(
      bookingId,
      amount,
      currency,
      pending ? { propertySlug: pending.propertySlug, propertyName: pending.propertyName } : undefined,
    )

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
