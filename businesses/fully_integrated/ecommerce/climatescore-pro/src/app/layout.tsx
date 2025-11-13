import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ClimateScore Pro',
  description: 'AI-powered platform that instantly generates sustainability compliance reports and carbon footprint scores for small businesses, turning complex climate data into actionable insights and certification badges. Businesses get automated ESG reporting while unlocking green marketing opportunities and meeting supplier requirements.',
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
