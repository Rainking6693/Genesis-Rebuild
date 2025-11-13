import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoSell Academy',
  description: 'AI-powered learning platform that teaches e-commerce businesses how to implement profitable sustainability practices through micro-courses, automated compliance tracking, and community-driven case studies. Combines educational content with actionable automation tools that immediately reduce costs while improving environmental impact.',
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
