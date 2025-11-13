import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ReviewSync Pro',
  description: 'AI-powered review management platform that automatically responds to customer reviews across all platforms while maintaining brand voice and escalating negative reviews to human managers. It combines automation with community-driven templates and mental health support for overwhelmed business owners dealing with review anxiety.',
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
