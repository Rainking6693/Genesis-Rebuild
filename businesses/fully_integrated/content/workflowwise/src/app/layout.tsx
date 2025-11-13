import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WorkflowWise',
  description: 'AI-powered platform that creates personalized workflow automation blueprints and templates for small businesses, combining interactive tutorials with ready-to-deploy no-code solutions. Users get step-by-step video guides, template libraries, and custom automation recommendations based on their industry and team size.',
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
