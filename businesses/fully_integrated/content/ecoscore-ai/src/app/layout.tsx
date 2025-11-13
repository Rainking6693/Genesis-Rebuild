import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoScore AI',
  description: 'AI-powered sustainability analytics platform that automatically generates personalized carbon footprint reports and actionable reduction strategies for small businesses. Combines climate tech with AI productivity tools to transform complex environmental data into simple, branded reports that businesses can share with customers and stakeholders.',
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
