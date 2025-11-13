import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CreatorCRM Pro',
  description: 'An AI-powered CRM specifically designed for content creators to manage brand partnerships, track campaign performance, and automate client communications. It combines creator economy tools with micro-SaaS automation to help influencers scale their business operations like professional agencies.',
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
