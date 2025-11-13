import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoScore Analytics',
  description: 'AI-powered sustainability analytics platform that automatically tracks, scores, and optimizes small businesses' environmental impact while generating compliance reports and customer-facing eco-credentials. Combines climate tech with automation to turn sustainability from a cost center into a competitive advantage and revenue driver.',
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
