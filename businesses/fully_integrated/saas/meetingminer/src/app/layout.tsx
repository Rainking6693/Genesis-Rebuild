import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MeetingMiner',
  description: 'AI-powered platform that automatically extracts actionable business insights from remote team meetings and converts them into trackable tasks, knowledge base articles, and competitive intelligence reports. Think of it as your team's automated business analyst that never misses a detail and helps small businesses turn meeting discussions into strategic advantage.',
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
