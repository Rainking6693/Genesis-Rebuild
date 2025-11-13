import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VideoScript AI',
  description: 'AI-powered platform that transforms blog posts, product descriptions, and social media content into professional video scripts optimized for different platforms (TikTok, YouTube Shorts, Instagram Reels). Includes AI voiceover generation, scene suggestions, and automated posting schedules to help businesses scale their video content without hiring expensive creators.',
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
