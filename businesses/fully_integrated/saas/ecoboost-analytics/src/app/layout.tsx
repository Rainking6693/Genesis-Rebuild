import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoBoost Analytics',
  description: 'AI-powered sustainability analytics platform that automatically tracks and optimizes e-commerce businesses' carbon footprint while providing customers with real-time environmental impact scores at checkout. Transforms environmental compliance from a cost center into a competitive advantage that drives customer loyalty and premium pricing.',
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
