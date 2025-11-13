import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoFleet Pro',
  description: 'AI-powered SaaS platform that helps small businesses automatically track, optimize, and offset their delivery carbon footprint while providing customers with real-time sustainability scores. Combines climate tech with micro-SaaS tools to turn environmental compliance into a competitive advantage for SMBs.',
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
