import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoTrace Commerce',
  description: 'AI-powered sustainability analytics platform that helps e-commerce businesses automatically track, report, and market their environmental impact to increasingly eco-conscious consumers. We turn complex carbon footprint data into compelling product stories and certifications that drive sales and customer loyalty.',
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
