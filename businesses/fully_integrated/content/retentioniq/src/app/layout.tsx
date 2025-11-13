import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RetentionIQ',
  description: 'AI-powered customer retention analytics platform that automatically identifies at-risk customers and generates personalized win-back campaigns for small e-commerce businesses. Combines predictive AI with ready-to-deploy email/SMS templates that increase customer lifetime value by 40%.',
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
