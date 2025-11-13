import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MoodCart AI',
  description: 'AI-powered emotional commerce platform that analyzes customer mood patterns to optimize product recommendations and reduce impulse purchase regret. Helps e-commerce businesses increase customer satisfaction and lifetime value by matching products to emotional states and providing post-purchase wellness tracking.',
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
