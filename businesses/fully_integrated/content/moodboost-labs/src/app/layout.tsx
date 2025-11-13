import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MoodBoost Labs',
  description: 'AI-powered micro-learning platform that delivers personalized 60-second mental wellness content to employees based on their real-time mood and productivity patterns. Combines bite-sized expert content with mood tracking automation to reduce workplace burnout and increase team performance.',
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
