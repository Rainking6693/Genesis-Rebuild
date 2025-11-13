import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ShiftSync Pro',
  description: 'AI-powered micro-SaaS that automatically generates optimized work schedules for small businesses while integrating real-time availability tracking and instant shift-swap automation. Eliminates the endless back-and-forth of manual scheduling and reduces no-shows by 80% through smart predictive algorithms.',
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
