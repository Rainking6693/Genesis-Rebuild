import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoTeam Hub',
  description: 'AI-powered platform that gamifies workplace sustainability initiatives by creating team challenges, tracking carbon footprint reduction, and providing automated compliance reporting for small businesses. Combines climate tech with community engagement through competitive leaderboards and automated carbon credit purchasing.',
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
