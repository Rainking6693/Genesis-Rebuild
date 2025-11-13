import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StressLens Pro',
  description: 'AI-powered workplace wellness platform that analyzes team communication patterns (Slack, email, calendar) to predict burnout risks and automatically generates personalized mental health interventions. Combines real-time stress detection with actionable wellness recommendations specifically designed for small business teams.',
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
