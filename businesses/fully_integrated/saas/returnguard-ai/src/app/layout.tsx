import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ReturnGuard AI',
  description: 'AI-powered micro-SaaS that automatically analyzes customer return patterns and generates personalized retention offers to reduce e-commerce return rates by 40%. Transforms costly returns into revenue opportunities through intelligent intervention campaigns that trigger before customers initiate returns.',
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
