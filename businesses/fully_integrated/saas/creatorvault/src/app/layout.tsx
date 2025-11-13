import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CreatorVault',
  description: 'AI-powered subscription box curation platform that helps content creators monetize their expertise by automatically generating and managing niche subscription boxes for their audiences. Creators input their knowledge areas and audience preferences, while AI handles product sourcing, box themes, supplier negotiations, and logistics coordination.',
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
