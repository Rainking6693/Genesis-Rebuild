import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MindFlow Analytics',
  description: 'An AI-powered mental wellness platform that analyzes team communication patterns (Slack, email, meetings) to predict burnout risk and automatically deliver personalized micro-interventions through existing workflows. It combines workplace mental health monitoring with productivity insights, helping small businesses prevent costly turnover while boosting team performance.',
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
