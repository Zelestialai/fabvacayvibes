'use client'
import { useEffect } from 'react'
import { captureUtmParams } from '../lib/utm'

/**
 * Mounts in the root layout and captures UTM / oppref params on the first
 * page load. Stored in sessionStorage for use by the booking flow redirect.
 * Renders nothing — pure side-effect component.
 */
export default function UtmCapture() {
  useEffect(() => {
    captureUtmParams()
  }, [])

  return null
}
