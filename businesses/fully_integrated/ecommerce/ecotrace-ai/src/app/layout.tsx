import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoTrace AI',
  description: 'AI-powered carbon footprint tracking and automated offset marketplace that integrates with e-commerce stores to provide real-time sustainability insights and one-click carbon neutrality for every purchase. Combines climate tech with micro-SaaS automation to turn environmental responsibility into a competitive advantage for online retailers.',
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
