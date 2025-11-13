import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MindfulMetrics',
  description: 'An AI-powered workplace wellness platform that automatically tracks team stress patterns through Slack/Teams integration and delivers personalized mental health micro-interventions. Companies get real-time burnout prevention analytics while employees receive anonymous, bite-sized wellness content tailored to their communication patterns.',
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
