import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CarbonTrail',
  description: 'AI-powered carbon footprint tracker specifically for e-commerce businesses that automatically calculates shipping emissions and suggests sustainable alternatives to increase customer loyalty. Integrates with major e-commerce platforms to provide real-time sustainability insights and customer-facing carbon offset options at checkout.',
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
