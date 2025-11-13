import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoCommerce Analytics',
  description: 'AI-powered sustainability scoring and carbon tracking platform that helps e-commerce businesses automatically calculate, display, and offset their products' environmental impact while boosting green sales conversions. Combines real-time supply chain data with consumer sustainability preferences to drive profitable eco-conscious purchasing decisions.',
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
