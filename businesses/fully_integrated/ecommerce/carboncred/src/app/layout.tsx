import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CarbonCred',
  description: 'AI-powered carbon credit marketplace that automatically calculates, purchases, and manages carbon offsets for small businesses based on their actual operational data. We transform climate compliance from a burden into a competitive advantage by providing transparent, automated carbon neutrality with detailed impact reporting.',
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
