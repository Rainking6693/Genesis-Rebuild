import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ReturnFlow AI',
  description: 'AI-powered return management platform that transforms product returns into personalized upsell opportunities while automating sustainable disposal through local donation networks. Converts cost centers into profit drivers by intelligently routing returned items to charity tax deductions, resale channels, or refurbishment partners.',
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
