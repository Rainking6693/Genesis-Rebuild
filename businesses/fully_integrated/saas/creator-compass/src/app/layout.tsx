import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Creator Compass',
  description: 'AI-powered subscription optimization platform that helps content creators and small businesses automatically test, track, and maximize revenue from multiple subscription tiers across platforms. Combines creator economy tools with personal finance insights to turn one-time followers into recurring revenue streams through smart pricing psychology and retention automation.',
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
