import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CreatorCash Flow',
  description: 'AI-powered financial planning SaaS specifically designed for content creators and freelancers with irregular income streams. Automatically tracks earnings across platforms, predicts cash flow patterns, and provides personalized budgeting recommendations to help creators achieve financial stability.',
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
