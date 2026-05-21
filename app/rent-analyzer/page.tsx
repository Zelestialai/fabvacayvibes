import type { Metadata } from 'next'
import Nav from '../components/Nav'
import RentAnalyzerForm from './RentAnalyzerForm'

export const metadata: Metadata = {
  title: 'Free Rent Analyzer — Estimate Your STR Revenue | Fab Vacay Vibes',
  description: 'Enter any US property address to get an instant short-term rental revenue estimate. Powered by AirROI data covering 20M+ properties.',
}

export default function RentAnalyzerPage() {
  return (
    <>
      <Nav />
      <RentAnalyzerForm />
    </>
  )
}
