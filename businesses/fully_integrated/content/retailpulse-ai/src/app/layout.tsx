import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RetailPulse AI',
  description: 'AI-powered micro-learning platform that delivers personalized, bite-sized retail training content based on real-time store performance data and customer feedback. Transforms generic employee training into dynamic, store-specific skill development that directly impacts sales metrics.',
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
