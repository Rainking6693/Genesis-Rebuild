import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CarbonFlow',
  description: 'AI-powered subscription platform that automatically calculates small businesses' carbon footprint and delivers personalized monthly carbon offset packages with verified impact tracking. Combines climate tech with subscription commerce to make carbon neutrality effortless and affordable for SMBs.',
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
