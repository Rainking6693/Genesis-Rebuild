import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ShopScript AI',
  description: 'AI-powered platform that automatically generates personalized product demo scripts and video outlines for e-commerce brands based on customer data and trending content formats. Transforms boring product listings into engaging, conversion-optimized content that speaks directly to different customer segments.',
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
