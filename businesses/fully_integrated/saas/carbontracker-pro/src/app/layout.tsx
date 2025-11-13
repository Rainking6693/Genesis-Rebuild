import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CarbonTracker Pro',
  description: 'AI-powered carbon footprint tracking and offset automation platform that helps small businesses automatically calculate, report, and reduce their environmental impact while earning sustainability certifications. Transforms complex climate compliance into simple, automated workflows that boost brand reputation and meet B2B customer sustainability requirements.',
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
