import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StoryBridge AI',
  description: 'AI-powered platform that transforms small business data and operations into compelling customer stories and case studies for marketing. Automatically generates testimonials, success stories, and social proof content by analyzing customer interactions, sales data, and support tickets.',
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
