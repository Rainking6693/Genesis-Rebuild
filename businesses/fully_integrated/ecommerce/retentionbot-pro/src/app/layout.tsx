import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RetentionBot Pro',
  description: 'AI-powered micro-SaaS that automatically generates personalized win-back email campaigns for e-commerce stores by analyzing customer purchase patterns and behavioral triggers. It integrates with existing e-commerce platforms to identify at-risk customers and deploys targeted retention sequences that typically recover 15-25% of churning customers.',
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
