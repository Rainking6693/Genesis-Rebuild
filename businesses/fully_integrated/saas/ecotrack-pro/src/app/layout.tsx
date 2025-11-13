import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoTrack Pro',
  description: 'AI-powered carbon footprint tracking and sustainability reporting platform that automatically calculates small businesses' environmental impact from their existing tools (accounting, shipping, utilities) and generates compliance-ready ESG reports. Turns complex climate regulations into automated workflows while helping businesses discover cost-saving green alternatives through our marketplace integration.',
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
