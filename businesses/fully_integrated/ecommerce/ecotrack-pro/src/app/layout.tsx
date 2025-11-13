import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoTrack Pro',
  description: 'AI-powered sustainability dashboard that automatically tracks and offsets the carbon footprint of small business operations, purchases, and shipping in real-time. Transforms compliance headaches into competitive advantages by generating automated ESG reports and customer-facing sustainability badges.',
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
