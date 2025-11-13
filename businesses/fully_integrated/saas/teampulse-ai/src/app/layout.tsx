import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TeamPulse AI',
  description: 'AI-powered mental wellness dashboard that automatically analyzes team communication patterns (Slack, email, meetings) to predict burnout risk and suggest personalized interventions before problems escalate. Unlike generic wellness apps, it provides actionable insights for managers while protecting employee privacy through anonymized sentiment analysis.',
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
