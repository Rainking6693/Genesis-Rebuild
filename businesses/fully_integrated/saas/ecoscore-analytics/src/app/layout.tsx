import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoScore Analytics',
  description: 'AI-powered sustainability scoring platform that automatically tracks and scores small businesses' environmental impact across operations, then generates automated improvement recommendations and compliance reports. Combines real-time data monitoring with community-driven sustainability challenges to gamify eco-friendly business practices.',
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
