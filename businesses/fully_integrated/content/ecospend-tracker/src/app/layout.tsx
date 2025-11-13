import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoSpend Tracker',
  description: 'AI-powered platform that tracks your spending's carbon footprint in real-time and provides personalized climate-friendly alternatives to reduce both costs and environmental impact. Users get detailed sustainability reports, community challenges, and automated recommendations for eco-friendly purchases that often cost less.',
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
