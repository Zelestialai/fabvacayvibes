/**
 * UTM parameter persistence for Fab Vacay Vibes.
 *
 * On first landing, UTM params and the OpenAI Ads Manager `oppref` click
 * reference are captured from the URL and stored in sessionStorage.
 * They survive same-tab navigation and are available to attach to the
 * OwnerRez payment redirect URL, keeping campaign attribution intact.
 *
 * Rules:
 * - Only reads params the visitor actually landed with — never synthesised.
 * - sessionStorage is per-tab and clears when the tab closes.
 * - All reads/writes are wrapped in try/catch (private browsing can throw).
 * - Never appended to canonical URLs or internal links.
 */

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
const SESSION_KEY = 'fvv_campaign_params'

export type CampaignParams = Partial<Record<(typeof UTM_KEYS)[number] | 'oppref', string>>

/** Call once on page load (client-side). Stores params from the current URL. */
export function captureUtmParams(): void {
  if (typeof window === 'undefined') return
  try {
    const url = new URL(window.location.href)
    const captured: CampaignParams = {}

    for (const key of UTM_KEYS) {
      const val = url.searchParams.get(key)
      if (val) captured[key] = val
    }

    // OpenAI Ads Manager click reference
    const oppref = url.searchParams.get('oppref')
    if (oppref) captured.oppref = oppref

    if (Object.keys(captured).length > 0) {
      // Only overwrite if new params are present — don't clear a prior landing
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(captured))
    }
  } catch {
    // sessionStorage unavailable — silent no-op
  }
}

/** Returns stored campaign params, or an empty object if none. */
export function getStoredUtmParams(): CampaignParams {
  if (typeof window === 'undefined') return {}
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as CampaignParams) : {}
  } catch {
    return {}
  }
}

/**
 * Appends stored UTM params (and oppref) to a URL string.
 * Used when building the OwnerRez payment redirect URL so GA4 and
 * OpenAI Ads Manager can attribute the booking to the original campaign.
 *
 * Does NOT overwrite params already present in the target URL.
 */
export function appendUtmToUrl(url: string): string {
  try {
    const parsed = new URL(url)
    const stored = getStoredUtmParams()
    for (const [key, value] of Object.entries(stored)) {
      if (value && !parsed.searchParams.has(key)) {
        parsed.searchParams.set(key, value)
      }
    }
    return parsed.toString()
  } catch {
    return url // return unchanged if URL is invalid
  }
}
