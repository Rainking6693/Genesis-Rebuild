import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CreatorSync',
  description: 'AI-powered automation platform that helps content creators automatically manage their subscription box businesses by generating personalized product curation, handling customer segmentation, and optimizing inventory based on audience engagement data. It combines creator economy tools with sustainable e-commerce automation to turn any content creator into a subscription box entrepreneur without operational overhead.',
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
