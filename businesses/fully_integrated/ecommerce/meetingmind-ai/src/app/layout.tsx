import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MeetingMind AI',
  description: 'AI-powered meeting intelligence platform that automatically generates actionable insights, tracks commitment follow-through, and creates personalized productivity reports for remote teams. Transforms chaotic meeting cultures into accountability-driven workflows that actually move business forward.',
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
