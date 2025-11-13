import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoFleet Insights',
  description: 'AI-powered platform that automatically tracks, analyzes, and optimizes small businesses' carbon footprint while generating compliance reports and cost-saving recommendations. Combines real-time sustainability scoring with automated workflow suggestions that reduce both environmental impact and operational costs.',
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
