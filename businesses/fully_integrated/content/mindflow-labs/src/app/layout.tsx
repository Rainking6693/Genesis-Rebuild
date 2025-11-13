import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MindFlow Labs',
  description: 'AI-powered mental wellness platform that creates personalized productivity rituals by combining cognitive behavioral therapy techniques with workflow optimization for remote teams. Delivers bite-sized, science-backed content modules that improve both individual mental health and team performance metrics.',
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
