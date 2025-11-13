import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Burnout Buddy',
  description: 'AI-powered micro-coaching platform that delivers personalized burnout prevention content and wellness nudges directly integrated into remote workers' daily workflows through Slack/Teams. Combines mental health insights with productivity analytics to create custom intervention strategies before burnout occurs.',
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
