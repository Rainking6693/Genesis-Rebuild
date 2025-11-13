import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ReviewFlow AI',
  description: 'AI-powered review management platform that automatically generates personalized response templates for customer reviews across all platforms, then learns from business owner edits to improve future responses. Transforms review management from a 2-hour daily task into a 10-minute approval process while maintaining authentic brand voice.',
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
