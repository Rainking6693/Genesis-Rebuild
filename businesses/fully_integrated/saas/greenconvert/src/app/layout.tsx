import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GreenConvert',
  description: 'AI-powered sustainability optimizer that automatically calculates and displays the carbon footprint of every product on e-commerce sites, then converts eco-conscious shoppers with personalized green alternatives and carbon offset options. Transforms climate anxiety into purchase confidence while boosting conversion rates for sustainable brands.',
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
