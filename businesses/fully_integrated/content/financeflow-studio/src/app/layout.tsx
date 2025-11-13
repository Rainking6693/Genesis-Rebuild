import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FinanceFlow Studio',
  description: 'AI-powered platform that automatically generates personalized financial education content and interactive calculators for small businesses to embed on their websites, boosting customer engagement and trust. Combines personal finance education with white-label SaaS tools that help businesses become trusted financial advisors to their customers.',
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
