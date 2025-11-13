import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CarbonLedger Pro',
  description: 'AI-powered carbon accounting platform that automatically tracks, calculates, and offsets small business emissions while generating compliance reports for ESG requirements. Transforms complex sustainability reporting into a simple monthly subscription with automated data collection from business tools like accounting software, shipping APIs, and utility bills.',
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
