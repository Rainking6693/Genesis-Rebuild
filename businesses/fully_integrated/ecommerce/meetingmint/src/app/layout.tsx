import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MeetingMint',
  description: 'AI-powered SaaS that transforms chaotic remote meetings into actionable business outcomes by automatically generating smart follow-ups, tracking commitments, and creating accountability workflows. Unlike basic transcription tools, MeetingMint focuses on post-meeting execution and team accountability with viral sharing features that drive organic growth.',
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
