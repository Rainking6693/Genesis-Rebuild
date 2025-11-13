import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GreenStack Analytics',
  description: 'AI-powered sustainability tracking platform that automatically calculates and optimizes carbon footprints for e-commerce businesses while turning eco-achievements into customer acquisition tools. Combines real-time environmental impact monitoring with automated green marketing campaigns that boost sales and customer loyalty.',
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
