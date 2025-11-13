import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CarbonCarts',
  description: 'AI-powered carbon footprint tracking for e-commerce purchases that gamifies sustainable shopping with rewards and team challenges. Helps conscious consumers and remote teams make eco-friendly buying decisions while earning points redeemable for carbon offsets or sustainable products.',
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
