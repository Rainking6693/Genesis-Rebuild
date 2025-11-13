import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ClimateScore Pro',
  description: 'AI-powered carbon footprint calculator that automatically tracks and scores small businesses' environmental impact through integrated financial data, generating compliance reports and actionable reduction recommendations. Helps SMBs meet ESG requirements while reducing costs through AI-optimized sustainability strategies.',
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
