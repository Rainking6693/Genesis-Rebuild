import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StoreFlow AI',
  description: 'An AI-powered no-code platform that automatically generates personalized email sequences, product recommendations, and conversion-optimized landing pages for e-commerce stores based on customer behavior data. It combines mental health principles with sales psychology to create empathetic, non-pushy marketing content that builds genuine customer relationships.',
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
