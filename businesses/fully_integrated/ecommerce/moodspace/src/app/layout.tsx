import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MoodSpace',
  description: 'AI-powered workspace environment optimization platform that analyzes remote workers' productivity patterns and automatically suggests/sells personalized workspace products, lighting, and wellness tools. Combines mental health insights with e-commerce recommendations to create the perfect productive home office environment.',
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
