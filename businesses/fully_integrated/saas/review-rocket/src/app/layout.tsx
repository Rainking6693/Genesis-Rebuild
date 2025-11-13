import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Review Rocket',
  description: 'AI-powered review response automation platform that helps small businesses generate personalized, brand-consistent responses to customer reviews across all platforms in seconds. Combines sentiment analysis with custom brand voice training to turn negative reviews into customer retention opportunities while scaling positive engagement.',
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
