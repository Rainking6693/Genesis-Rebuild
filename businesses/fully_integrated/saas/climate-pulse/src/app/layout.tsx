import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Climate Pulse',
  description: 'AI-powered sustainability automation platform that helps small businesses automatically track, reduce, and monetize their carbon footprint through real-time integrations with their existing tools. Transforms climate compliance from a cost center into a revenue generator by identifying cost-saving opportunities and unlocking green incentives.',
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
