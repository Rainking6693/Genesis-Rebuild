import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StoryScript AI',
  description: 'An AI-powered no-code platform that transforms business data and processes into engaging video narratives for marketing and training. Small businesses upload their workflows, customer journeys, or product data, and our AI generates compelling story-driven video content with professional voiceovers and animations.',
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
