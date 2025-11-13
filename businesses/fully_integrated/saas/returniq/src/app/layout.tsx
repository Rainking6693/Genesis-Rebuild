import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ReturnIQ',
  description: 'AI-powered return management platform that transforms product returns into customer retention opportunities through personalized exchanges, instant store credits, and predictive analytics. Helps e-commerce businesses reduce return costs by 40% while increasing customer lifetime value through smart retention workflows.',
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
