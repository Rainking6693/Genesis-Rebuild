import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MoodSync Pro',
  description: 'AI-powered workplace mental health platform that analyzes team communication patterns to predict burnout risks and automatically suggests personalized wellness interventions. Combines sentiment analysis of Slack/Teams messages with productivity metrics to create actionable mental health dashboards for managers and HR teams.',
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
