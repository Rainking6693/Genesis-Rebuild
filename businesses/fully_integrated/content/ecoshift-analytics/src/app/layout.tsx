import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoShift Analytics',
  description: 'AI-powered platform that generates personalized sustainability transition reports for e-commerce businesses, combining carbon footprint analysis with actionable profit-boosting recommendations. We turn environmental compliance from a cost center into a revenue driver by identifying eco-friendly optimizations that reduce costs and attract conscious consumers.',
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
