import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RetentionAI',
  description: 'AI-powered customer retention platform that automatically generates personalized win-back campaigns for ecommerce businesses based on real-time behavioral analysis. Combines community insights from similar businesses with AI-driven automation to recover churning customers before they're lost forever.',
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
