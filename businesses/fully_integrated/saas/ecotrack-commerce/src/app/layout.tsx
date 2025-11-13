import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoTrack Commerce',
  description: 'AI-powered sustainability analytics platform that helps e-commerce businesses automatically track, optimize, and market their environmental impact to boost sales with eco-conscious consumers. Small businesses get real-time carbon footprint insights, automated sustainability badges, and conversion-optimized green marketing tools that increase average order value by 15-30%.',
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
