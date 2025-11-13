import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MoodSync Pro',
  description: 'AI-powered workplace wellness platform that analyzes team communication patterns to predict burnout risks and automatically generates personalized mental health content and interventions. Combines sentiment analysis of Slack/Teams messages with curated wellness resources to create a proactive mental health safety net for remote teams.',
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
