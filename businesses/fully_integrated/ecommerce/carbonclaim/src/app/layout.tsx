import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CarbonClaim',
  description: 'AI-powered platform that automatically calculates and offsets the carbon footprint of every ecommerce transaction, turning sustainability into a competitive advantage for online stores. Customers receive instant carbon-neutral certificates and businesses get detailed emissions analytics to optimize their supply chain.',
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
