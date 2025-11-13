import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Carbon Ledger',
  description: 'AI-powered platform that automatically tracks, verifies, and showcases small businesses' sustainability efforts through real-time carbon accounting and customer-facing impact stories. Transforms compliance headaches into marketing gold by generating authentic sustainability content that drives customer loyalty and premium pricing.',
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
