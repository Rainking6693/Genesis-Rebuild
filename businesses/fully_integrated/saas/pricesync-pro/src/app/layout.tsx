import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PriceSync Pro',
  description: 'AI-powered dynamic pricing automation for small e-commerce businesses that monitors competitors, market trends, and inventory levels to optimize prices in real-time for maximum profit margins. Combines the power of AI automation with personal finance insights for business owners to track revenue impact and profit optimization.',
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
