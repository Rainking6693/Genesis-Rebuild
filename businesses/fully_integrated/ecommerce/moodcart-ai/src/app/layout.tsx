import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MoodCart AI',
  description: 'AI-powered personalized shopping platform that curates products based on users' emotional states and mental wellness goals, combining sustainable brands with mood-boosting purchase recommendations. Uses sentiment analysis of social media, calendar events, and user input to deliver perfectly timed product suggestions that enhance wellbeing.',
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
