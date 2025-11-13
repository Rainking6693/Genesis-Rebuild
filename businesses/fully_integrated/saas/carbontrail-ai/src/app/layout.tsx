import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CarbonTrail AI',
  description: 'AI-powered carbon footprint tracker that automatically calculates and offsets business expenses in real-time by integrating with accounting software and expense platforms. Transforms every business purchase into an opportunity for climate action while providing detailed sustainability reporting for ESG compliance.',
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
