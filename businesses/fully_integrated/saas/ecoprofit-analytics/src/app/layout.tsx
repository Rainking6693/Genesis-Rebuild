import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoProfit Analytics',
  description: 'AI-powered sustainability tracking platform that helps small businesses automatically calculate their carbon footprint from financial transactions and convert eco-improvements into tax credits and cost savings. Turn your business expenses into environmental insights and profit opportunities through automated ESG reporting and green incentive discovery.',
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
