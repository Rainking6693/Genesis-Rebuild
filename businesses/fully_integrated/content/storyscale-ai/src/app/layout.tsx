import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StoryScale AI',
  description: 'AI-powered content transformation platform that converts single pieces of content into 20+ formats across different channels, specifically designed for small businesses without dedicated marketing teams. Combines creator economy tools with no-code automation to help businesses scale their content reach without hiring agencies.',
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
