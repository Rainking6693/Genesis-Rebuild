import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MoodFlow Analytics',
  description: 'AI-powered platform that analyzes team communication patterns across Slack, email, and meetings to predict burnout, optimize workload distribution, and boost productivity through automated mental health insights. Combines workplace wellness monitoring with actionable AI recommendations that managers can implement immediately.',
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
