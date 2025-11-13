import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StressLens AI',
  description: 'AI-powered workplace stress analytics platform that automatically detects team burnout signals from digital communication patterns and generates personalized wellness content recommendations for managers. Combines mental health insights with AI productivity tools to prevent employee turnover before it happens.',
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
