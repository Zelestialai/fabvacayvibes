import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fab Vacay Vibes — Luxury Vacation Rentals',
  description: "Three handpicked luxury estates across America's most breathtaking landscapes. Beach, Mountain, Desert. Book direct for the best rates.",
  keywords: 'luxury vacation rentals, Clearwater beach rental, Joshua Tree rental, Oakhurst mountain rental',
  openGraph: {
    title: 'Fab Vacay Vibes — Luxury Vacation Rentals',
    description: 'Beach, Mountain, Desert. Three extraordinary estates. Book direct and save.',
    url: 'https://fabvacayvibes.com',
    siteName: 'Fab Vacay Vibes',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
