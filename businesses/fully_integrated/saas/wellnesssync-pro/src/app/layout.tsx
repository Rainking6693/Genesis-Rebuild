import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WellnessSync Pro',
  description: 'AI-powered employee wellness automation platform that integrates with workplace tools to predict burnout, suggest personalized interventions, and track team mental health metrics in real-time. Combines micro-wellness check-ins with automated coaching recommendations to prevent productivity drops before they happen.',
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
