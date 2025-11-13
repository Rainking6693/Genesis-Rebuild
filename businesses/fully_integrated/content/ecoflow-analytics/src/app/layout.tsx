import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoFlow Analytics',
  description: 'AI-powered sustainability analytics platform that automatically tracks, scores, and optimizes small businesses' environmental impact while generating marketing content around their green initiatives. Transforms compliance burden into competitive advantage by creating authentic sustainability stories that boost customer loyalty and attract eco-conscious consumers.',
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
