import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CarbonScore Pro',
  description: 'AI-powered carbon footprint calculator and sustainability content platform that generates personalized climate action plans for remote teams and small businesses. Creates automated ESG reports, team challenges, and actionable sustainability content to help companies reduce their environmental impact while boosting employee engagement.',
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
