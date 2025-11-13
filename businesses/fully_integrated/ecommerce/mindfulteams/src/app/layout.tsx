import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MindfulTeams',
  description: 'AI-powered mental wellness subscription platform that delivers personalized stress-relief boxes to small business teams while providing data-driven wellness insights to managers. Combines physical wellness products with digital mental health tracking and team-building activities to boost productivity and reduce burnout.',
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
