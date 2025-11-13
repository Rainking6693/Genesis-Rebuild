import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CreatorCRM Pro',
  description: 'AI-powered CRM specifically designed for content creators to automatically track brand partnerships, manage sponsor relationships, and optimize collaboration rates. Combines creator economy insights with automated outreach and performance analytics to turn content creation into a scalable business operation.',
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
