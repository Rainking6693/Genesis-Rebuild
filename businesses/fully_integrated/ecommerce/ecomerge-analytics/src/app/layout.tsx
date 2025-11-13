import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoMerge Analytics',
  description: 'AI-powered sustainability analytics platform that automatically tracks, scores, and optimizes the environmental impact of small business operations while generating compliance reports and carbon offset recommendations. Turns climate responsibility into a competitive advantage with automated ESG reporting and customer-facing sustainability badges.',
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
