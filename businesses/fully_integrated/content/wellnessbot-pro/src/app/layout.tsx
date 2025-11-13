import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WellnessBot Pro',
  description: 'AI-powered wellness content automation platform that generates personalized health newsletters, social media posts, and client check-ins for wellness professionals and small health businesses. Combines health expertise with creator economy tools to help practitioners scale their content marketing while maintaining authenticity and compliance.',
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
