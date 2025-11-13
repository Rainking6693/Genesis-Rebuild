import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MoodMail AI',
  description: 'AI-powered email marketing platform that analyzes customer sentiment and mental health indicators to automatically adjust email tone, timing, and content for maximum engagement and wellness-conscious communication. Helps e-commerce brands build deeper emotional connections while respecting customer mental health boundaries.',
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
