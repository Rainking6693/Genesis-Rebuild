import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MoodMetrics',
  description: 'AI-powered emotional intelligence analytics platform that helps remote teams track, understand, and improve workplace mental health through automated sentiment analysis of team communications. Creates personalized wellness content and intervention recommendations based on real-time mood patterns detected in Slack, email, and video calls.',
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
