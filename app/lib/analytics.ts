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
    fbq?: (...args: unknown[]) => void
  }
}

/** Safe gtag call — silently skips if the tag hasn't loaded yet. */
function gtag(...args: unknown[]) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args)
  }
}

/**
 * Safe Meta Pixel call — silently skips if the pixel isn't installed
 * (NEXT_PUBLIC_META_PIXEL_ID unset) or hasn't loaded yet.
 */
function fbq(...args: unknown[]) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq(...args)
  }
}

// ---------------------------------------------------------------------------
// Pending booking — bridges the hop to the OwnerRez payment page.
//
// OwnerRez's RedirectAfterBookingUrl is a fixed URL (/booking-confirmed) and
// is not guaranteed to carry booking details back. So just before sending the
// guest to pay, we save the quote ID and total in localStorage. The
// confirmation page reads it once and deletes it, so a refresh can't re-fire
// the conversion. Entries older than 48h are ignored (abandoned payments).
// No PII is stored — only the OwnerRez quote ID, total and property.
// ---------------------------------------------------------------------------
const PENDING_KEY = 'fvv_pending_booking'
const PENDING_MAX_AGE_MS = 48 * 60 * 60 * 1000

export type PendingBooking = {
  quoteId: string
  total?: number
  propertySlug: string
  propertyName: string
}

export function savePendingBooking(b: PendingBooking) {
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify({ ...b, ts: Date.now() }))
  } catch { /* storage unavailable — silent no-op */ }
}

/** Returns the pending booking (if fresh) and deletes it so it's used once. */
export function consumePendingBooking(): PendingBooking | null {
  try {
    const raw = localStorage.getItem(PENDING_KEY)
    if (!raw) return null
    localStorage.removeItem(PENDING_KEY)
    const parsed = JSON.parse(raw)
    if (!parsed.quoteId || !parsed.ts || Date.now() - parsed.ts > PENDING_MAX_AGE_MS) return null
    return parsed as PendingBooking
  } catch {
    return null
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
  fbq('track', 'ViewContent', {
    content_ids: [params.propertySlug],
    content_name: params.propertyName,
    content_type: 'product',
    value: params.pricePerNight,
    currency: 'USD',
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
  fbq('track', 'InitiateCheckout', {
    content_ids: [params.propertySlug],
    content_name: params.propertyName,
    content_type: 'product',
    value: params.totalAmount,
    currency: 'USD',
    num_items: params.nights,
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
  fbq('track', 'Lead', {
    content_ids: [params.propertySlug],
    content_name: params.propertyName,
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
export function trackPurchaseFromUrl(
  preBookingId?: string | null,
  preAmount?: string | null,
  preCurrency?: string | null,
  property?: { propertySlug: string; propertyName: string },
) {
  if (typeof window === 'undefined') return

  // Prefer pre-parsed values from useSearchParams (avoids App Router URL rewrite race).
  // Fall back to window.location.search for legacy callers.
  let bookingId: string | null
  let amountStr: string | null
  let currency: string

  if (preBookingId !== undefined) {
    bookingId = preBookingId || null
    amountStr = preAmount || null
    currency = preCurrency || 'USD'
  } else {
    const params = new URLSearchParams(window.location.search)
    bookingId = params.get('booking_id') || params.get('bookingId') || params.get('reservation_id')
    amountStr = params.get('amount') || params.get('total')
    currency = params.get('currency') || 'USD'
  }

  // Only fire when OwnerRez supplies at least a booking ID in the URL.
  if (!bookingId) return

  const amount = amountStr ? parseFloat(amountStr) : undefined

  const hasAmount = amount !== undefined && !isNaN(amount)

  gtag('event', 'purchase', {
    transaction_id: bookingId,
    ...(hasAmount ? { value: amount, currency } : {}),
    items: [
      {
        ...(property ? { item_id: property.propertySlug, item_name: property.propertyName } : {}),
        item_category: 'vacation_rental',
        quantity: 1,
        ...(hasAmount ? { price: amount } : {}),
      },
    ],
  })

  // Meta Pixel — eventID lets Meta de-duplicate if a server-side event is
  // added later (Conversions API).
  fbq(
    'track',
    'Purchase',
    {
      ...(property ? { content_ids: [property.propertySlug], content_name: property.propertyName } : {}),
      content_type: 'product',
      // Meta requires value + currency on Purchase; 0 when the total is unknown.
      value: hasAmount ? amount : 0,
      currency,
    },
    { eventID: bookingId },
  )

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
