import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MoodMetrics AI',
  description: 'AI-powered workplace wellness dashboard that analyzes team communication patterns to predict burnout risks and provides personalized mental health interventions. Transforms Slack/Teams data into actionable wellness insights for small business managers who want to prevent employee turnover before it happens.',
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
