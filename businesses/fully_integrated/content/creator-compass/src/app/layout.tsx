import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Creator Compass',
  description: 'AI-powered content intelligence platform that analyzes trending topics across 50+ platforms and generates personalized content briefs with viral hooks for creators and small business marketers. Combines real-time trend analysis with automated content strategy recommendations to help users create high-performing content consistently.',
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
