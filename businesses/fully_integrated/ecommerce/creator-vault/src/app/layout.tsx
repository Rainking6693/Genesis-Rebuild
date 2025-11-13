import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Creator Vault',
  description: 'AI-powered digital asset marketplace where content creators sell premium templates, presets, and digital tools with automated licensing and usage tracking. Combines creator economy monetization with AI-driven personalization to match buyers with exactly the digital assets they need for their projects.',
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
