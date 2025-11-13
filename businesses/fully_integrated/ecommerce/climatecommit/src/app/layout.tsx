import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ClimateCommit',
  description: 'AI-powered platform that automatically tracks small businesses' carbon footprint through their existing tools (Shopify, QuickBooks, etc.) and creates verified sustainability reports for customers while connecting them to a marketplace of vetted carbon offset projects. Turns environmental compliance from a burden into a competitive advantage and revenue driver for SMBs.',
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
