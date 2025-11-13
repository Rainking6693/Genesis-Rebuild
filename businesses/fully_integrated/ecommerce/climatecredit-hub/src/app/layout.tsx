import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ClimateCredit Hub',
  description: 'AI-powered marketplace that helps small businesses automatically purchase verified carbon credits through their existing subscriptions and services, turning every business transaction into climate action. Businesses earn sustainability badges and reporting while supporting vetted climate projects, with zero manual effort required.',
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
