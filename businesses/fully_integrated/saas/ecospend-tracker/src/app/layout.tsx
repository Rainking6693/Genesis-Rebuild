import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoSpend Tracker',
  description: 'AI-powered personal finance app that automatically tracks your carbon footprint through spending patterns and rewards eco-friendly purchases with cashback and community challenges. Combines financial wellness with climate action by turning sustainable spending into a gamified social experience with real monetary rewards.',
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
