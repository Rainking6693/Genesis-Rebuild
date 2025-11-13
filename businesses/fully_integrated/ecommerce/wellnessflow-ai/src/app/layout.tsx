import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WellnessFlow AI',
  description: 'AI-powered workplace wellness platform that automatically generates personalized mental health and productivity micro-interventions for employees based on their work patterns, stress levels, and team dynamics. Creates custom wellness product bundles and delivers them subscription-style to boost employee retention and reduce burnout costs for SMBs.',
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
