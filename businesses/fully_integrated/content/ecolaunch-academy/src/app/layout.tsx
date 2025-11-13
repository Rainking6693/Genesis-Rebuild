import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoLaunch Academy',
  description: 'AI-powered learning platform that teaches small business owners how to implement profitable climate-tech solutions through interactive case studies and no-code automation tools. Combines sustainability education with actionable business growth strategies, featuring real ROI calculators and implementation roadmaps.',
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
