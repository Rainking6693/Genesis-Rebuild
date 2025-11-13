import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CreatorCash',
  description: 'AI-powered financial dashboard that automatically tracks, categorizes, and optimizes income streams for content creators across multiple platforms (YouTube, TikTok, Substack, etc.). Provides tax-ready reports, cash flow predictions, and personalized monetization recommendations based on audience analytics.',
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
