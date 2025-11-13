import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RetentionLab',
  description: 'AI-powered customer retention intelligence platform that analyzes e-commerce customer behavior to automatically generate personalized re-engagement content campaigns. Combines Web3 loyalty mechanics with health/wellness-style habit formation to turn one-time buyers into subscription customers.',
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
