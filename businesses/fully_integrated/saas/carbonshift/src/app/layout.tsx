import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CarbonShift',
  description: 'AI-powered carbon footprint tracker for e-commerce businesses that automatically calculates emissions from supply chain activities and provides actionable sustainability recommendations. Helps online retailers meet ESG goals while attracting eco-conscious customers through transparent carbon impact reporting.',
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
