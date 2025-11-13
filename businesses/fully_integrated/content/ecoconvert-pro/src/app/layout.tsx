import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoConvert Pro',
  description: 'AI-powered sustainability audit and conversion optimization platform that helps e-commerce businesses automatically identify eco-friendly product alternatives and create compelling green marketing content that increases conversions. Combines real-time sustainability scoring with automated content generation to turn environmental consciousness into profitable sales.',
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
