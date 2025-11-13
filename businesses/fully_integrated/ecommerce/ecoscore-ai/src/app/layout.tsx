import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoScore AI',
  description: 'AI-powered sustainability analytics platform that automatically calculates and optimizes the environmental impact score of any ecommerce business's operations, supply chain, and product catalog. Transforms complex climate data into actionable insights and automated green marketing content that increases conversions by 23% while reducing carbon footprint.',
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
