import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoFlow Insights',
  description: 'AI-powered sustainability analytics platform that generates automated carbon footprint reports and actionable reduction strategies for e-commerce businesses. Combines real-time supply chain data with expert sustainability content to help online retailers meet ESG goals and attract eco-conscious consumers.',
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
