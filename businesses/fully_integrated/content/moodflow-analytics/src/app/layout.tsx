import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MoodFlow Analytics',
  description: 'AI-powered mental wellness platform that automatically tracks team mood patterns through Slack/Teams integration and provides managers with actionable insights to prevent burnout before it happens. Combines real-time sentiment analysis with personalized wellness content recommendations for each team member.',
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
