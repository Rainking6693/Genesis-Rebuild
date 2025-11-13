import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MindFlow Studio',
  description: 'AI-powered mental wellness content creation platform that helps remote teams generate personalized mindfulness sessions, stress-relief workshops, and team bonding activities. Combines mental health focus with creator economy tools to let HR professionals and team leaders become internal wellness content creators without expertise.',
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
