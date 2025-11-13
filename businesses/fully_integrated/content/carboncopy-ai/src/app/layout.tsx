import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CarbonCopy AI',
  description: 'AI-powered platform that transforms small businesses into sustainable brands by automatically generating carbon-neutral messaging, eco-friendly product descriptions, and sustainability reports that boost conversions. Combines climate tech insights with AI content generation to help businesses tap into the $150B sustainable commerce market without hiring expensive sustainability consultants.',
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
