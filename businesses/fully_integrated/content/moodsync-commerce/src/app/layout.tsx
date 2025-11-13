import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MoodSync Commerce',
  description: 'AI-powered mental wellness platform that creates personalized product recommendations and curated shopping experiences based on users' emotional states and stress levels. Combines mental health tracking with affiliate commerce to help users discover products that genuinely improve their wellbeing while generating revenue through strategic partnerships.',
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
