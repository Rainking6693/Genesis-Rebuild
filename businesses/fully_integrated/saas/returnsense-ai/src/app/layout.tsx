import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ReturnSense AI',
  description: 'AI-powered returns management platform that automatically categorizes returned products, generates sustainability reports, and creates personalized retention campaigns to reduce future returns. Transforms e-commerce returns from pure cost centers into customer retention and sustainability optimization opportunities.',
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
