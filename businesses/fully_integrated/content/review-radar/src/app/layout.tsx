import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Review Radar',
  description: 'AI-powered review monitoring and response automation platform that tracks mentions across 50+ review sites, generates personalized responses using brand voice, and creates actionable reputation reports. Transforms overwhelming review management into a 10-minute weekly task for small businesses.',
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
