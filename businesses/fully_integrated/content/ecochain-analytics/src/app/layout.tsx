import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoChain Analytics',
  description: 'AI-powered sustainability tracking platform that generates automated compliance reports and carbon footprint analytics for small e-commerce businesses using blockchain verification. We turn complex environmental data into actionable insights and marketing content that helps businesses meet regulations while attracting eco-conscious customers.',
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
