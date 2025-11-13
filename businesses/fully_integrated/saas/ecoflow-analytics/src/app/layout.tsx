import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoFlow Analytics',
  description: 'AI-powered sustainability tracking platform that helps e-commerce businesses automatically calculate, display, and offset their carbon footprint while turning eco-consciousness into a competitive advantage. Combines real-time environmental impact analytics with customer-facing sustainability badges that boost conversion rates by appealing to environmentally conscious shoppers.',
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
