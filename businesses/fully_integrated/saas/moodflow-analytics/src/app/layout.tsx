import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MoodFlow Analytics',
  description: 'AI-powered employee wellness dashboard that automatically tracks team mood patterns through Slack/Teams interactions and provides actionable mental health insights for remote managers. Combines sentiment analysis with productivity metrics to prevent burnout before it happens and optimize team performance.',
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
