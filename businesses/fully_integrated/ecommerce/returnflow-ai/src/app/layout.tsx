import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ReturnFlow AI',
  description: 'AI-powered return management SaaS that automatically processes product returns, generates smart shipping labels, and creates personalized retention offers to convert returns into exchanges or store credit. We transform the costly return experience into a profit center by using machine learning to predict return reasons and proactively offer solutions before customers hit 'return'.',
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
