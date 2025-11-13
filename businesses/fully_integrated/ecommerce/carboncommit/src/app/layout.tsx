import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CarbonCommit',
  description: 'An AI-powered B2B SaaS platform that automatically calculates and offsets the carbon footprint of every business transaction, then generates compliance reports and customer-facing sustainability certificates. Businesses pay per transaction processed, creating a scalable model that grows with their success while helping them meet ESG goals effortlessly.',
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
