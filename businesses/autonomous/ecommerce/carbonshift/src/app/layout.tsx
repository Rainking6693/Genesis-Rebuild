import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CarbonShift',
  description: 'AI-powered sustainability analytics platform that helps e-commerce businesses automatically calculate, reduce, and offset their carbon footprint while turning eco-friendly practices into competitive marketing advantages. We transform complex climate data into actionable insights and customer-facing sustainability badges that boost conversion rates.',
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
