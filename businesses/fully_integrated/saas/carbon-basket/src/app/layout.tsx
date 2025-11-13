import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Carbon Basket',
  description: 'AI-powered micro-SaaS that automatically calculates and offsets the carbon footprint of every e-commerce purchase in real-time, turning eco-anxiety into actionable climate impact. Seamlessly integrates with any online store to provide customers instant carbon transparency and one-click offset purchasing at checkout.',
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
