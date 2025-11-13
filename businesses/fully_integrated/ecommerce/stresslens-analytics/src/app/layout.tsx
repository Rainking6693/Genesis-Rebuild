import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StressLens Analytics',
  description: 'AI-powered workplace mental health platform that analyzes team communication patterns (Slack, emails, meetings) to predict burnout risk and automatically generates personalized wellness interventions. Combines mental health monitoring with productivity analytics to help small businesses retain talent and reduce stress-related turnover.',
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
