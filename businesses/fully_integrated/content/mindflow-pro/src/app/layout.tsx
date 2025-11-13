import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MindFlow Pro',
  description: 'AI-powered mental wellness platform that creates personalized stress management micro-courses for remote teams and small businesses. Combines real-time stress detection through work patterns with bite-sized, scientifically-backed wellness content delivered at optimal moments throughout the workday.',
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
