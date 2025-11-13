import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FinFlow Academy',
  description: 'AI-powered financial literacy platform that creates personalized learning paths for small business owners, combining bite-sized educational content with automated cash flow management tools. Users learn financial concepts while simultaneously implementing them in their actual business through integrated no-code financial dashboards.',
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
