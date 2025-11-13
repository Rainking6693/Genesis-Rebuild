import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MindfulSell',
  description: 'AI-powered platform that helps e-commerce brands create mental wellness-focused product content and community experiences to boost customer loyalty and reduce return rates. Combines sustainable shopping psychology with AI-generated wellness content that positions products as mindful lifestyle choices rather than impulse purchases.',
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
