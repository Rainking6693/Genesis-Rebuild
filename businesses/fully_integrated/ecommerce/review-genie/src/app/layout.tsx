import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Review Genie',
  description: 'AI-powered subscription service that automatically generates authentic, compliant product reviews and customer testimonials for e-commerce businesses using purchase data and customer surveys. Combines review automation with a marketplace where verified customers can earn rewards for detailed feedback on products they've actually purchased.',
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
