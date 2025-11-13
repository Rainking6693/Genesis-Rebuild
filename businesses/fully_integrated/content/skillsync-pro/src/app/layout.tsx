import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SkillSync Pro',
  description: 'AI-powered micro-learning platform that creates personalized 5-minute daily skill courses for remote teams based on their actual work challenges and knowledge gaps. Combines real workplace data with bite-sized expert content to deliver just-in-time learning that immediately impacts productivity.',
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
