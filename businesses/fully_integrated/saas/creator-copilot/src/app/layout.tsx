import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Creator Copilot',
  description: 'AI-powered automation platform that transforms content creators into efficient businesses by automatically handling client communications, proposal generation, and project management. It uses AI to analyze creator portfolios and automatically match them with relevant brand collaboration opportunities while managing the entire workflow.',
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
