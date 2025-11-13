import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ReviewBoost AI',
  description: 'AI-powered platform that helps small e-commerce businesses automatically generate personalized follow-up campaigns to increase customer reviews and repeat purchases. Combines review management with smart customer retention automation to boost revenue by 25-40% through targeted post-purchase engagement.',
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
