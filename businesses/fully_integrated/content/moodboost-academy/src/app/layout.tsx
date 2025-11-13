import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MoodBoost Academy',
  description: 'AI-powered micro-learning platform that delivers personalized 3-minute mental wellness courses based on real-time mood tracking and workplace stress patterns. Combines bite-sized educational content with mood analytics to help professionals build resilience skills during their actual workday stress moments.',
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
