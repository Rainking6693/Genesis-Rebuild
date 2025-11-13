import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PostCraft AI',
  description: 'An AI-powered social media automation platform that creates, schedules, and optimizes content specifically for small businesses by analyzing their industry trends and competitor strategies. It combines no-code workflow builders with intelligent content generation to help businesses maintain consistent, engaging social presence without hiring agencies.',
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
