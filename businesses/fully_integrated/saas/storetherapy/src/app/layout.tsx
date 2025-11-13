import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StoreTherapy',
  description: 'AI-powered mental wellness platform that helps e-commerce entrepreneurs and small business owners manage stress, burnout, and decision fatigue through personalized micro-coaching sessions and automated wellness workflows. Combines business performance tracking with mental health insights to optimize both profit and well-being.',
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
