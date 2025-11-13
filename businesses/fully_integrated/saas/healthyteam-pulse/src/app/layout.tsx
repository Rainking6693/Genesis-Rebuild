import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HealthyTeam Pulse',
  description: 'AI-powered wellness automation platform that monitors team health metrics through Slack/Teams integration and automatically suggests personalized interventions to reduce burnout and boost productivity. Combines anonymous health check-ins with smart scheduling, break reminders, and team wellness challenges to create healthier remote work cultures.',
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
