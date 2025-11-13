import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CommunityCommerce',
  description: 'An AI-powered platform that transforms any community (Discord, Slack, Facebook Groups) into a sustainable e-commerce marketplace where members can buy, sell, and recommend eco-friendly products with built-in carbon tracking. Communities earn recurring revenue through automated affiliate programs and member subscription tiers while fostering sustainable purchasing habits.',
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
