import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CarbonCart',
  description: 'AI-powered sustainability analytics platform that helps e-commerce businesses automatically calculate, offset, and market their carbon footprint to environmentally conscious consumers. Transforms environmental compliance from a cost center into a competitive advantage and revenue driver through automated green marketing campaigns.',
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
