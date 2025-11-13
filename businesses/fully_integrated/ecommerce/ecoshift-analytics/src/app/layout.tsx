import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoShift Analytics',
  description: 'AI-powered sustainability compliance platform that automatically tracks, analyzes, and optimizes small businesses' carbon footprint while generating regulatory reports and cost-saving recommendations. Transforms overwhelming climate regulations into actionable insights that save money and ensure compliance.',
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
