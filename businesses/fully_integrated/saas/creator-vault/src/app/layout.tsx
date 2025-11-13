import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Creator Vault',
  description: 'AI-powered subscription box curation platform that helps content creators monetize their expertise by automatically generating personalized physical product boxes for their audience. Combines creator economy monetization with subscription commerce, using AI to match creator content themes with relevant products from vetted suppliers.',
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
