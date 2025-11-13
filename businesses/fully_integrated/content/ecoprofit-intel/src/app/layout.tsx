import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoProfit Intel',
  description: 'AI-powered platform that analyzes e-commerce businesses and generates personalized sustainability reports with actionable profit-boosting recommendations. Combines real-time market data, carbon footprint analysis, and consumer behavior insights to help online retailers increase revenue while meeting growing eco-conscious demand.',
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
