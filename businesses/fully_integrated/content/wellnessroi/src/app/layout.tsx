import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WellnessROI',
  description: 'AI-powered wellness program ROI calculator that helps small businesses measure and optimize their employee wellness investments with personalized recommendations. Combines health analytics with financial insights to prove wellness program value through reduced healthcare costs, improved productivity, and lower turnover rates.',
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
