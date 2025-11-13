import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RetentionBot AI',
  description: 'AI-powered subscription retention platform that automatically identifies at-risk customers and deploys personalized win-back campaigns across email, SMS, and in-app notifications. Uses machine learning to predict churn 30-90 days before it happens and automatically executes proven retention playbooks.',
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
