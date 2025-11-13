import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoStream Hub',
  description: 'AI-powered platform that automatically creates personalized sustainability content and shopping recommendations for eco-conscious consumers while helping sustainable brands reach their ideal customers through micro-influencer partnerships. Combines content creation automation with community-driven product discovery to build the ultimate sustainable lifestyle ecosystem.',
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
