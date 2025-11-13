import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MindfulSales',
  description: 'AI-powered mental wellness platform specifically designed for sales professionals to manage rejection stress, maintain peak performance, and build resilience through personalized micro-interventions during their workday. Combines sales CRM integration with real-time mood tracking and evidence-based mental health techniques delivered at the moment of need.',
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
