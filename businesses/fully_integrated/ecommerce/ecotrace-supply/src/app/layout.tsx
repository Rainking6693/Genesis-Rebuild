import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoTrace Supply',
  description: 'AI-powered carbon footprint tracking and supplier sustainability scoring platform that helps small e-commerce businesses automatically calculate, display, and offset their products' environmental impact while building customer trust. Combines climate tech with micro-SaaS tools to turn sustainability compliance into a competitive advantage and revenue driver.',
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
