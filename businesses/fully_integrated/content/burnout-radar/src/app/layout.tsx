import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Burnout Radar',
  description: 'AI-powered platform that analyzes team communication patterns (Slack, email, calendars) to predict and prevent employee burnout before it happens. Provides personalized wellness interventions and manager dashboards with actionable insights to improve team mental health and productivity.',
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
