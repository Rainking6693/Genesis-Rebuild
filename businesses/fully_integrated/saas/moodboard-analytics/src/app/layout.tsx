import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MoodBoard Analytics',
  description: 'AI-powered platform that analyzes team communication patterns (Slack, email, meetings) to predict burnout risks and automatically suggest personalized wellness interventions before productivity drops. Think of it as a 'check engine light' for team mental health that integrates seamlessly into existing remote work tools.',
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
