import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PolicyPulse AI',
  description: 'AI-powered micro-SaaS that automatically tracks, analyzes, and translates complex industry regulations into actionable compliance checklists for small businesses. Delivers personalized regulatory updates via smart notifications and generates audit-ready documentation with zero manual input.',
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
