import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StoryChain AI',
  description: 'AI-powered content authenticity platform that helps small businesses create and verify original marketing content while building blockchain-verified proof of ownership. Combines AI content generation with Web3 authenticity verification to solve the growing problem of content plagiarism and brand trust in digital marketing.',
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
