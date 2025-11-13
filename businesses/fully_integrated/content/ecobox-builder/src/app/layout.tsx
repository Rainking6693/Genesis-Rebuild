import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoBox Builder',
  description: 'A no-code platform that enables sustainable product creators to launch subscription box services with AI-powered curation and community features. Small eco-businesses can build, customize, and manage their subscription commerce without technical skills while connecting with environmentally conscious consumers.',
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
