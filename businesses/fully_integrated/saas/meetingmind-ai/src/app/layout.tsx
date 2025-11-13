import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MeetingMind AI',
  description: 'AI-powered meeting intelligence platform that automatically captures, analyzes, and transforms team meetings into actionable insights, mental health check-ins, and productivity recommendations. It combines remote work optimization with proactive team wellness monitoring to prevent burnout while maximizing collaboration effectiveness.',
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
