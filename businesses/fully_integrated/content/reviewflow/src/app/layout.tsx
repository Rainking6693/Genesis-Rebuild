import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ReviewFlow',
  description: 'AI-powered micro-SaaS that automatically generates personalized review request campaigns and tracks customer sentiment across all platforms for small e-commerce businesses. Combines automated email/SMS sequences with AI-driven sentiment analysis to boost positive reviews while flagging potential issues before they become public complaints.',
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
