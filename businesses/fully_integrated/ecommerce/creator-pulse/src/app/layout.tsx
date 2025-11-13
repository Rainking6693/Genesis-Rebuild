import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Creator Pulse',
  description: 'AI-powered analytics platform that tracks and predicts creator economy trends, helping small businesses identify the perfect micro-influencers before they go viral. Combines real-time social media data with predictive algorithms to score creators on growth potential, audience authenticity, and brand alignment.',
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
