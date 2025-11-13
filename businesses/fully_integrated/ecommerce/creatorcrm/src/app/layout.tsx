import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CreatorCRM',
  description: 'AI-powered customer relationship management platform specifically designed for content creators to monetize their audience through personalized product recommendations and automated sales funnels. Combines creator economy insights with e-commerce automation to turn followers into paying customers.',
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
