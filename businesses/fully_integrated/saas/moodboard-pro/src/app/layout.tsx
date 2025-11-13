import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MoodBoard Pro',
  description: 'AI-powered employee sentiment analytics platform that automatically detects team mood patterns through Slack/Teams communications and provides actionable mental health interventions for remote managers. Combines real-time emotional intelligence with personalized wellness recommendations to prevent burnout before it happens.',
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
