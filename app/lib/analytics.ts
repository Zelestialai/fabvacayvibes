/**
 * GA4 analytics helpers for Fab Vacay Vibes.
 *
 * Rules enforced here:
 * - Never send PII (names, emails, phone numbers, payment details)
 * - Never fire purchase for a page view or click alone
 * - All event calls are no-ops when gtag is not yet initialised
 * - Each event is fired at most once per user action (callers are responsible
 *   for not mounting the same component twice)
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

/** Safe gtag call — silently skips if the tag hasn't loaded yet. */
function gtag(...args: unknown[]) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args)
  }
}

// ---------------------------------------------------------------------------
// view_item — fire when a property detail page is rendered in the browser
// ---------------------------------------------------------------------------
export function trackViewItem(params: {
  propertySlug: string
  propertyName: string
  pricePerNight: number
}) {
  gtag('event', 'view_item', {
    currency: 'USD',
    value: params.pricePerNight,
    items: [
      {
        item_id: params.propertySlug,
        item_name: params.propertyName,
        item_category: 'vacation_rental',
        price: params.pricePerNight,
        quantity: 1,
      },
    ],
  })
}

// ---------------------------------------------------------------------------
// begin_checkout — fire when the visitor clicks "Book Now" (quote → guest step)
// ---------------------------------------------------------------------------
export function trackBeginCheckout(params: {
  propertySlug: string
  propertyName: string
  totalAmount: number
  nights: number
}) {
  gtag('event', 'begin_checkout', {
    currency: 'USD',
    value: params.totalAmount,
    items: [
      {
        item_id: params.propertySlug,
        item_name: params.propertyName,
        item_category: 'vacation_rental',
        price: params.totalAmount,
        quantity: params.nights,
      },
    ],
  })
}

// ---------------------------------------------------------------------------
// generate_lead — fire when an inquiry form is successfully submitted
// ---------------------------------------------------------------------------
export function trackGenerateLead(params: {
  propertySlug: string
  propertyName: string
}) {
  gtag('event', 'generate_lead', {
    currency: 'USD',
    // We don't know the booking value at inquiry time, so we omit `value`
    // to avoid inventing a number.
    items: [
      {
        item_id: params.propertySlug,
        item_name: params.propertyName,
        item_category: 'vacation_rental',
      },
    ],
  })
}

// ---------------------------------------------------------------------------
// purchase — fire on /booking-confirmed when OwnerRez redirects back
//
// OwnerRez appends these params to the RedirectAfterBookingUrl:
//   ?booking_id=<id>&amount=<total>&currency=<USD>
//
// We read them from the URL; if they are absent we do NOT fire the event,
// because a stale page refresh would re-fire the conversion.
// ---------------------------------------------------------------------------
export function trackPurchaseFromUrl() {
  if (typeof window === 'undefined') return

  const params = new URLSearchParams(window.location.search)
  const bookingId = params.get('booking_id') || params.get('bookingId') || params.get('reservation_id')
  const amountStr = params.get('amount') || params.get('total')
  const currency = params.get('currency') || 'USD'

  // Only fire when OwnerRez supplies at least a booking ID in the URL.
  if (!bookingId) return

  const amount = amountStr ? parseFloat(amountStr) : undefined

  gtag('event', 'purchase', {
    transaction_id: bookingId,
    ...(amount !== undefined && !isNaN(amount) ? { value: amount, currency } : {}),
    items: [
      {
        item_category: 'vacation_rental',
        quantity: 1,
        ...(amount !== undefined && !isNaN(amount) ? { price: amount } : {}),
      },
    ],
  })

  // Remove the params from the URL bar so a reload doesn't re-fire.
  const clean = new URL(window.location.href)
  clean.searchParams.delete('booking_id')
  clean.searchParams.delete('bookingId')
  clean.searchParams.delete('reservation_id')
  clean.searchParams.delete('amount')
  clean.searchParams.delete('total')
  clean.searchParams.delete('currency')
  window.history.replaceState({}, '', clean.toString())
}
