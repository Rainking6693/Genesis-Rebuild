import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoShift Analytics',
  description: 'AI-powered sustainability analytics platform that helps small e-commerce businesses automatically track, optimize, and market their carbon footprint to eco-conscious customers. Transform environmental compliance from a cost center into a competitive advantage and revenue driver through automated sustainability scoring and customer-facing eco-badges.',
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
