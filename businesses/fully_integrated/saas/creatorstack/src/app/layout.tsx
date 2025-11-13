import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CreatorStack',
  description: 'AI-powered community monetization platform that helps content creators automatically transform their audience interactions into premium, searchable knowledge bases. Creators can instantly monetize their expertise by turning Discord chats, YouTube comments, and live streams into subscription-based Q&A databases that fans pay to access.',
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
