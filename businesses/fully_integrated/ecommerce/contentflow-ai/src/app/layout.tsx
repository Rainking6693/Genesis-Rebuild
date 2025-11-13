import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ContentFlow AI',
  description: 'AI-powered content repurposing platform that automatically transforms long-form content into 20+ formats optimized for different social platforms and audiences. Small businesses upload one piece of content and get a month's worth of social media posts, email sequences, and marketing copy instantly.',
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
