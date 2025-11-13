import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ClimateROI Pro',
  description: 'AI-powered platform that generates personalized sustainability compliance reports and carbon offset investment recommendations for small businesses. Combines climate tech with financial analysis to help SMBs turn environmental compliance into profit centers through tax incentives, grants, and cost savings identification.',
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
