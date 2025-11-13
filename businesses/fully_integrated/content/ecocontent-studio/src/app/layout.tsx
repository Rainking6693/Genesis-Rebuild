import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoContent Studio',
  description: 'AI-powered content creation platform that automatically generates sustainability-focused marketing content for eco-conscious brands, complete with carbon impact tracking and green certification badges. Combines climate tech data with creator economy tools to help businesses authentically communicate their environmental initiatives through automated, compliant content workflows.',
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
