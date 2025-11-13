import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ShopFlow AI',
  description: 'AI-powered automation platform that creates personalized customer journey workflows for small e-commerce businesses, automatically triggering email sequences, discount codes, and retargeting campaigns based on real-time shopping behavior. Unlike generic email tools, ShopFlow AI learns each store's unique customer patterns and creates custom automation recipes that increase conversion rates by 40-60%.',
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
