import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Carbon Credits',
  description: 'AI-powered platform that automatically calculates small business carbon footprints and creates personalized monthly subscription boxes of verified carbon offset credits bundled with eco-friendly office supplies. Businesses get automated ESG compliance reporting while employees receive tangible sustainable products, creating a viral workplace sustainability program.',
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
