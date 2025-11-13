import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SkillStack AI',
  description: 'AI-powered platform that automatically generates personalized learning paths and micro-certifications for small business employees based on their role, company goals, and skill gaps. Combines educational technology with subscription-based learning while providing businesses with automated workforce development analytics.',
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
