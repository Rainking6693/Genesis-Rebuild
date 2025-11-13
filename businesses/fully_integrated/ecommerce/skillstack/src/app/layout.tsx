import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SkillStack',
  description: 'AI-powered micro-learning platform that creates personalized certification tracks for small business teams, combining bite-sized courses with blockchain-verified credentials. Employers can instantly validate employee skills while workers build stackable, transferable certifications across multiple domains.',
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
