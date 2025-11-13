import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CarbonTrail Pro',
  description: 'AI-powered carbon footprint tracking SaaS that automatically calculates and offsets small businesses' environmental impact through real-time integrations with their existing tools. Transforms compliance headaches into competitive advantages with automated ESG reporting and customer-facing sustainability badges.',
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
