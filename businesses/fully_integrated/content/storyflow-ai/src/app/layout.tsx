import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StoryFlow AI',
  description: 'AI-powered platform that transforms small business customer data and testimonials into automated, personalized case study content and social proof campaigns. Combines no-code automation with community-driven templates to help businesses create compelling customer success stories at scale.',
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
