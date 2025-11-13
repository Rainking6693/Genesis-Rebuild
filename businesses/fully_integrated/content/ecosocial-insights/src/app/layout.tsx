import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoSocial Insights',
  description: 'AI-powered sustainability marketing intelligence platform that helps e-commerce brands identify trending eco-conscious consumer behaviors and create viral green content. Combines real-time social sentiment analysis with carbon footprint data to generate weekly content strategies that boost both sales and environmental impact scores.',
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
