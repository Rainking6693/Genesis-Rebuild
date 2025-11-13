import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ReviewBoost AI',
  description: 'AI-powered review management platform that automatically generates personalized response templates and sentiment analysis for small e-commerce businesses. Combines community insights with mental health-conscious customer service to turn negative reviews into loyal customers through empathetic, data-driven responses.',
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
