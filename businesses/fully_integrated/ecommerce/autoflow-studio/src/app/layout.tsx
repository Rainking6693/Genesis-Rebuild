import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AutoFlow Studio',
  description: 'A no-code automation platform that helps small businesses create intelligent customer journey workflows by connecting their existing tools (CRM, email, social media) with AI-powered triggers and actions. Think Zapier meets customer success automation, but specifically designed for businesses without technical teams.',
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
