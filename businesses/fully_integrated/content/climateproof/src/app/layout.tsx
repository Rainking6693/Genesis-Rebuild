import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ClimateProof',
  description: 'AI-powered platform that generates personalized climate risk assessments and actionable adaptation strategies for small businesses. Combines real-time climate data with industry-specific insights to help businesses proactively protect their operations and unlock green financing opportunities.',
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
