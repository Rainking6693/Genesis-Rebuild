import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MeetingMind AI',
  description: 'AI-powered platform that transforms chaotic meeting recordings into actionable business intelligence, automatically generating follow-up tasks, risk assessments, and strategic insights. Unlike basic transcription tools, it creates a searchable knowledge base that identifies patterns, tracks commitments, and predicts project outcomes across your entire organization.',
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
