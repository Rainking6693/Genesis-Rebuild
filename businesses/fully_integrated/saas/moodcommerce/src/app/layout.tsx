import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MoodCommerce',
  description: 'AI-powered e-commerce personalization platform that adapts product recommendations and store layouts based on customers' real-time emotional state and mental wellness goals. Combines sentiment analysis of browsing behavior with wellness-focused product curation to increase conversions while promoting healthier purchasing decisions.',
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
