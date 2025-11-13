import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoShift AI',
  description: 'AI-powered sustainability automation platform that helps small e-commerce businesses automatically calculate, offset, and market their carbon footprint while turning green initiatives into customer acquisition tools. Combines real-time carbon tracking with automated marketing campaigns that showcase environmental impact to boost sales and customer loyalty.',
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
