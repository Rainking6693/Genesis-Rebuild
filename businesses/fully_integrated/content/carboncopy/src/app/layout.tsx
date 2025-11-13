import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CarbonCopy',
  description: 'AI-powered platform that automatically generates personalized carbon footprint reduction content and action plans for remote teams, turning climate action into engaging team challenges with measurable impact tracking. Companies get branded sustainability content libraries, employee engagement dashboards, and automated ESG reporting while employees receive gamified carbon reduction missions tailored to their remote work setup.',
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
