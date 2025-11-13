import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CarbonClaim',
  description: 'AI-powered platform that automatically tracks e-commerce businesses' carbon footprint across their supply chain and generates verified sustainability reports for customers at checkout. Transforms climate compliance from a cost center into a competitive advantage by enabling real-time carbon transparency that drives customer loyalty and premium pricing.',
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
