import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Carbon Copilot',
  description: 'AI-powered sustainability content platform that auto-generates personalized carbon reduction action plans and compliance reports for small businesses. Combines real-time emissions tracking with automated content creation to help SMBs meet ESG requirements while reducing operational costs.',
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
