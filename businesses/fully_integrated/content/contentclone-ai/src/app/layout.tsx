import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ContentClone AI',
  description: 'AI-powered platform that analyzes your top-performing content across platforms and automatically generates similar high-converting variations for consistent audience growth. Uses machine learning to identify your unique voice patterns and content DNA to create authentic, brand-consistent content at scale.',
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
