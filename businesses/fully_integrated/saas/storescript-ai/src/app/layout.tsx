import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StoreScript AI',
  description: 'AI-powered no-code platform that automatically generates and optimizes product descriptions, email sequences, and social media content for e-commerce stores based on product images and basic details. Small e-commerce businesses get professional copywriting at scale without hiring expensive agencies or spending hours writing content.',
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
