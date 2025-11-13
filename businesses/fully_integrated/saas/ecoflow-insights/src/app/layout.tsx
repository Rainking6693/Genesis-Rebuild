import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoFlow Insights',
  description: 'AI-powered carbon footprint tracking and sustainability automation platform that helps small businesses automatically calculate, reduce, and report their environmental impact while generating cost savings. Combines real-time expense monitoring with climate action recommendations, turning sustainability compliance into a profit center through tax incentives and operational efficiencies.',
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
