import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MoodFlow AI',
  description: 'AI-powered wellness automation platform that creates personalized daily mental health content and micro-interventions based on team mood analytics for small businesses. Combines anonymous employee sentiment tracking with automated delivery of targeted wellness resources, meditation scripts, and productivity tips.',
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
