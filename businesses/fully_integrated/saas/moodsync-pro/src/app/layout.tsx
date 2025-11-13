import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MoodSync Pro',
  description: 'AI-powered team mood analytics platform that tracks employee mental wellness through Slack/Teams integration and automatically generates personalized wellness recommendations for managers. Combines real-time sentiment analysis with proactive mental health interventions to reduce burnout and boost remote team productivity.',
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
