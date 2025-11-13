import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StressLens AI',
  description: 'AI-powered workplace stress monitoring platform that analyzes team communication patterns across Slack, email, and calendar data to predict burnout risks and automatically suggest personalized wellness interventions. Combines mental health insights with actionable business intelligence to reduce turnover and boost productivity.',
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
