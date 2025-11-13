import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GreenShift Analytics',
  description: 'AI-powered sustainability tracking platform that helps small e-commerce businesses automatically calculate, reduce, and market their carbon footprint while turning green initiatives into competitive advantages. Transform environmental compliance from a cost center into a profit driver through automated sustainability reporting and customer-facing green badges.',
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
