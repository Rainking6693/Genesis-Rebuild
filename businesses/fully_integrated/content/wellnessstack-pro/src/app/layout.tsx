import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WellnessStack Pro',
  description: 'AI-powered wellness content automation platform that generates personalized employee wellness newsletters, mental health tips, and wellness challenges for small businesses. Combines personal finance stress management, mental health insights, and workplace wellness into bite-sized, actionable content that HR teams can deploy instantly.',
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
