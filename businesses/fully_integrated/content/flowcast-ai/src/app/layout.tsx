import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FlowCast AI',
  description: 'AI-powered podcast generation platform that transforms small business expertise into professional podcast series, complete with automated transcription, show notes, and multi-platform distribution. Enables service-based businesses to scale their thought leadership and attract premium clients through consistent, high-quality audio content.',
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
