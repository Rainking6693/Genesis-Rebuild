import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RetentionBot AI',
  description: 'AI-powered customer retention automation platform that analyzes e-commerce customer behavior and automatically generates personalized re-engagement campaigns, recovery emails, and loyalty content. Combines health & wellness psychology principles with AI automation to reduce churn by 40% for online businesses.',
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
