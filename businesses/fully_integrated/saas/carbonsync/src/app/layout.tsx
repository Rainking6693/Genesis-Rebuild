import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CarbonSync',
  description: 'AI-powered carbon footprint tracking and offset automation for e-commerce businesses that automatically calculates shipping emissions, purchases verified carbon credits, and generates sustainability marketing content. Transform every order into a competitive advantage by making your business provably carbon-negative while boosting customer loyalty through transparent climate action.',
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
