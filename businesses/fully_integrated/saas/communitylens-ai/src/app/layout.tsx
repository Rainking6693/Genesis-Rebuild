import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CommunityLens AI',
  description: 'AI-powered community analytics platform that transforms Discord, Slack, and social media conversations into actionable business intelligence for product teams and marketers. Automatically identifies emerging trends, sentiment shifts, and feature requests from community chatter to inform product roadmaps and marketing strategies.',
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
