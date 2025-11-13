import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RetailIQ Pro',
  description: 'AI-powered competitive intelligence platform that automatically tracks competitor pricing, inventory, and marketing strategies for small e-commerce businesses. Delivers actionable insights through automated reports and real-time alerts to help online retailers stay competitive and maximize profits.',
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
