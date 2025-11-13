import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SkillStack Pro',
  description: 'AI-powered micro-learning platform that automatically creates personalized skill development paths for remote teams based on their actual work patterns and performance gaps. Unlike generic training platforms, it integrates with existing work tools to identify skill gaps in real-time and delivers bite-sized lessons during natural workflow breaks.',
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
