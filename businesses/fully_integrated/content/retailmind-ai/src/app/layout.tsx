import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RetailMind AI',
  description: 'AI-powered content automation platform that generates personalized product descriptions, email campaigns, and social media content for e-commerce brands by analyzing customer behavior and competitor strategies. Combines community-driven templates with AI automation to help small e-commerce businesses create converting content at scale without hiring expensive copywriters.',
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
