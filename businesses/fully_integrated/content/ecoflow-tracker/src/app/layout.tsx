import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoFlow Tracker',
  description: 'AI-powered carbon footprint analytics platform that automatically tracks and optimizes supply chain emissions for small e-commerce businesses. Generates compliance-ready sustainability reports and actionable reduction strategies while building customer trust through transparent environmental impact data.',
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
