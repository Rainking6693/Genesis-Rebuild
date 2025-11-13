import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Carbon Compass',
  description: 'AI-powered carbon footprint tracking and offset marketplace specifically designed for remote-first small businesses to automatically monitor, reduce, and offset their distributed team's environmental impact. Combines real-time emissions tracking with curated sustainability actions and verified carbon offset purchases, turning climate responsibility into a competitive advantage for modern businesses.',
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
