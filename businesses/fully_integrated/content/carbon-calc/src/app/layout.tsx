import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Carbon Calc',
  description: 'AI-powered carbon footprint calculator and reduction planner specifically designed for small e-commerce businesses to track, reduce, and market their sustainability efforts. Combines real-time shipping data, inventory tracking, and automated ESG reporting with customer-facing sustainability badges and marketing content.',
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
