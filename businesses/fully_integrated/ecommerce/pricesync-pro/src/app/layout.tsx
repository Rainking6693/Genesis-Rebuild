import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PriceSync Pro',
  description: 'AI-powered dynamic pricing automation tool that monitors competitor prices in real-time and automatically adjusts your e-commerce product prices to maximize profit margins while staying competitive. Built specifically for small e-commerce businesses who can't afford enterprise pricing tools but need to compete with larger retailers.',
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
