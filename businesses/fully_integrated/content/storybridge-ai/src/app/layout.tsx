import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StoryBridge AI',
  description: 'AI-powered micro-SaaS that transforms complex B2B case studies and technical content into engaging, multi-format stories optimized for different buyer personas. Creates personalized content variants (executive summaries, technical deep-dives, social posts) from a single input, helping B2B companies scale their content marketing without hiring writers.',
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
