import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TeamSync Analytics',
  description: 'AI-powered micro-SaaS that automatically tracks and optimizes remote team productivity by analyzing communication patterns across Slack, email, and project tools. Provides actionable insights and automated workflow suggestions to reduce meeting overhead and improve team efficiency by 30%.',
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
