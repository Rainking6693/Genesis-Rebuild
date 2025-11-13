import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ExpenseBot Pro',
  description: 'AI-powered expense management platform that automatically categorizes receipts, tracks business spending patterns, and generates tax-optimized reports for small businesses. Uses computer vision and smart automation to eliminate 90% of manual bookkeeping work while providing actionable financial insights.',
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
