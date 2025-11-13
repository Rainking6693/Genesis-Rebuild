import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Creator Sustain',
  description: 'AI-powered platform that helps content creators instantly find and sell sustainable product alternatives to items they feature, earning commissions while promoting eco-friendly choices. Combines affiliate marketing with sustainability data to create a guilt-free shopping experience for audiences who trust their favorite creators.',
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
