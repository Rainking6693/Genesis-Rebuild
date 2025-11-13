import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GreenTrack Pro',
  description: 'AI-powered sustainability tracking platform that automatically calculates and optimizes small businesses' carbon footprint while generating compliance reports and cost-saving recommendations. Combines climate tech with automation to turn environmental responsibility into a profit center through tax incentives, supplier negotiations, and operational efficiencies.',
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
