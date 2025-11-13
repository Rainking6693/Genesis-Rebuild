import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Carbon Crew',
  description: 'An AI-powered platform that generates personalized sustainability action plans and progress tracking for remote teams, turning climate action into engaging team challenges with real environmental impact measurement. Companies subscribe to boost employee engagement while achieving measurable ESG goals through gamified carbon reduction competitions.',
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
