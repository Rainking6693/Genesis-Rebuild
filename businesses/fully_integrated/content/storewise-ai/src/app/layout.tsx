import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StoreWise AI',
  description: 'AI-powered financial health dashboard that analyzes small business spending patterns across e-commerce platforms and generates personalized cost-optimization content and actionable insights. Combines expense tracking with curated educational content and peer benchmarking to help business owners make smarter purchasing decisions.',
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
