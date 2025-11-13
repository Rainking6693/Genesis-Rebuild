import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoTrack Pro',
  description: 'AI-powered carbon footprint tracking and ESG reporting platform that automatically generates compliance-ready sustainability reports for small businesses. Combines real-time data collection with expert content templates to help companies meet ESG requirements and attract eco-conscious customers.',
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
