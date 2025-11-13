import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Carbon Shopify',
  description: 'AI-powered carbon footprint tracking and offset automation for e-commerce stores that calculates environmental impact per order and automatically purchases verified carbon credits. Transforms climate anxiety into purchase confidence by showing customers their positive environmental impact in real-time.',
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
