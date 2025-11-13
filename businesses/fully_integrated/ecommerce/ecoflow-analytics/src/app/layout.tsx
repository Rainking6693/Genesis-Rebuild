import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoFlow Analytics',
  description: 'AI-powered sustainability tracking platform that automatically calculates and optimizes carbon footprints for small e-commerce businesses while generating customer-facing eco-impact reports. Turns environmental compliance into a competitive advantage by creating personalized sustainability stories that drive customer loyalty and premium pricing.',
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
