import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FinanceFlow Academy',
  description: 'AI-powered micro-learning platform that delivers personalized 5-minute daily financial lessons to small business owners, with automated progress tracking and real-world application challenges. Combines gamified learning with actionable financial templates and calculators that integrate directly into popular business tools like QuickBooks and Stripe.',
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
