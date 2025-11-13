import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MoodSync',
  description: 'AI-powered platform that automatically adjusts remote team productivity tools and meeting schedules based on real-time collective mood analysis from Slack/Teams communications. Combines mental health awareness with remote work optimization to boost team performance while preventing burnout.',
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
