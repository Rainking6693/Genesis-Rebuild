import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TeamPulse AI',
  description: 'AI-powered mental health and productivity platform that automatically analyzes team communication patterns (Slack, email, meetings) to predict burnout risk and suggest personalized wellness interventions. Combines anonymous sentiment analysis with actionable remote work optimization recommendations for managers and HR teams.',
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
