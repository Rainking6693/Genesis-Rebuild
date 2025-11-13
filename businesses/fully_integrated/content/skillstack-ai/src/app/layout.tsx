import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SkillStack AI',
  description: 'An AI-powered microlearning platform that automatically creates personalized skill development paths for remote teams by analyzing their project failures and knowledge gaps. It transforms workplace mistakes into structured learning opportunities with bite-sized lessons, peer mentoring, and team challenges.',
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
