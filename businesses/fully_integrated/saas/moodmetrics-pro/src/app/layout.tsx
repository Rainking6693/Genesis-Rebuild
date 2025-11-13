import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MoodMetrics Pro',
  description: 'AI-powered employee wellness analytics platform that transforms anonymous mood data into actionable business intelligence for small-medium businesses. Combines daily micro-check-ins with productivity tracking to predict burnout, optimize team dynamics, and reduce turnover while boosting revenue through data-driven workforce optimization.',
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
