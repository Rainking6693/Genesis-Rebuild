import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Creator Compliance',
  description: 'AI-powered platform that automatically generates legal disclaimers, terms of service, and compliance documentation for content creators and small e-commerce businesses. Eliminates the need for expensive lawyers while ensuring creators stay legally protected across different platforms and jurisdictions.',
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
