import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MoodCommerce',
  description: 'AI-powered emotional commerce platform that curates personalized product recommendations based on users' real-time mood and mental state. Combines mental health tracking with sustainable e-commerce to deliver 'emotional retail therapy' through mindful purchasing decisions.',
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
