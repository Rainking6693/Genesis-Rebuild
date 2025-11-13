import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SustainFlow',
  description: 'AI-powered sustainability compliance automation platform that helps e-commerce businesses automatically track, report, and optimize their carbon footprint while generating customer-facing sustainability scores. Turns regulatory burden into competitive advantage by creating automated ESG reports and customer trust signals that increase conversion rates.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
