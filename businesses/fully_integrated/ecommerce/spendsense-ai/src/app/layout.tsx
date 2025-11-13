import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SpendSense AI',
  description: 'AI-powered expense intelligence platform that automatically categorizes business receipts, predicts cash flow, and creates financial reports while building a community marketplace where small businesses can share and sell their anonymized spending insights to vendors and service providers. It combines personal finance automation with Web3-style data monetization, letting businesses earn passive income from their spending patterns.',
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
