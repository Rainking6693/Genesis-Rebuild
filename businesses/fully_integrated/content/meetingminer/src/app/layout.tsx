import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MeetingMiner',
  description: 'AI-powered meeting intelligence platform that automatically extracts actionable insights, decisions, and follow-ups from recorded meetings, then generates personalized learning content and process improvements for teams. Transforms boring meeting recordings into valuable knowledge assets and training materials that help teams work smarter.',
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
