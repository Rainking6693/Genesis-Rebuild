import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoSkill Hub',
  description: 'An AI-powered learning platform that teaches professionals climate-tech skills through bite-sized, interactive modules while automatically matching them with green job opportunities and sustainability projects. Think LinkedIn Learning meets climate action, with smart career pathways that turn environmental passion into profitable expertise.',
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
