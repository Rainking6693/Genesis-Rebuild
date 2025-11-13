import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ReviewSync AI',
  description: 'AI-powered platform that automatically monitors, analyzes, and responds to customer reviews across all major platforms while generating actionable insights to improve business operations. Combines review management with intelligent business intelligence to help small businesses turn customer feedback into competitive advantages.',
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
