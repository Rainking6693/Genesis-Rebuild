import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RetentionGenius',
  description: 'AI-powered subscription analytics platform that automatically generates personalized retention content and campaigns for SaaS businesses. It analyzes user behavior patterns and creates targeted email sequences, in-app messages, and educational content to reduce churn and increase customer lifetime value.',
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
