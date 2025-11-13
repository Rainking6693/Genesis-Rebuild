import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoScore Pro',
  description: 'AI-powered sustainability analytics platform that automatically tracks and scores small businesses' environmental impact across operations, supply chain, and customer engagement. Transforms complex sustainability data into actionable insights and customer-facing transparency reports that boost brand trust and sales.',
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
