import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CarbonCred AI',
  description: 'AI-powered carbon footprint tracking and offset marketplace that automatically calculates business emissions from receipts/invoices and connects companies to verified carbon credit projects. Small businesses get instant ESG compliance reporting while earning customer loyalty through transparent climate action.',
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
