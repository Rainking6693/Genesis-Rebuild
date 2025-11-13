import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoFlow AI',
  description: 'AI-powered sustainability content generator that creates personalized carbon reduction action plans and engaging social media content for small businesses to showcase their green initiatives. Turns complex climate data into viral-ready content while providing actionable sustainability roadmaps that actually reduce costs and boost brand reputation.',
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
