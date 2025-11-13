import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GreenTeam Hub',
  description: 'AI-powered platform that helps small businesses track, gamify, and monetize their team's sustainability efforts while building authentic green marketing content. Transform employee eco-actions into verified carbon credits, social media content, and customer trust through automated tracking and community challenges.',
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
