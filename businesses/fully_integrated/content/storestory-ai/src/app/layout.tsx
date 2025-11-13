import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StoreStory AI',
  description: 'AI-powered platform that automatically generates compelling product stories, brand narratives, and marketing copy for e-commerce stores by analyzing product data, customer reviews, and market trends. Transforms boring product listings into engaging stories that convert browsers into buyers through emotional connection and social proof.',
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
