import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoMetrics Pro',
  description: 'AI-powered sustainability tracking platform that automatically calculates and optimizes carbon footprints for small e-commerce businesses while generating customer-facing eco-badges and reports. Combines climate tech with e-commerce automation to turn environmental compliance into a competitive advantage and marketing tool.',
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
