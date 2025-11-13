import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RetentionBot',
  description: 'AI-powered customer retention automation that predicts churn risk and deploys personalized win-back campaigns across email, SMS, and in-app notifications. Combines behavioral analytics with automated intervention workflows to reduce customer churn by 40-60% for subscription businesses.',
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
