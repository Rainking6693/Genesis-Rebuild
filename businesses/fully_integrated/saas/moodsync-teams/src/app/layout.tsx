import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MoodSync Teams',
  description: 'AI-powered emotional intelligence platform that analyzes team communication patterns across Slack/Teams to predict burnout, optimize meeting schedules, and suggest personalized wellness interventions. Combines remote work optimization with proactive mental health support through automated sentiment analysis and behavioral pattern recognition.',
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
