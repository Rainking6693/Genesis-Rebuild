import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ReviewCraft AI',
  description: 'AI-powered platform that automatically generates authentic, compliant product reviews and testimonials for e-commerce businesses by analyzing actual customer data, purchase patterns, and feedback sentiment. Eliminates the time-consuming manual process of collecting and formatting customer testimonials while ensuring authenticity and compliance with platform guidelines.',
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
