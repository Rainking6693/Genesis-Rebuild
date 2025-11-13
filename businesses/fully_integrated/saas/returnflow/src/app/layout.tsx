import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ReturnFlow',
  description: 'AI-powered returns automation platform that transforms e-commerce returns from cost centers into profit centers by intelligently routing returned items to resale, donation, or recycling channels. Small e-commerce businesses reduce return processing costs by 60% while generating new revenue streams from previously wasted inventory.',
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
