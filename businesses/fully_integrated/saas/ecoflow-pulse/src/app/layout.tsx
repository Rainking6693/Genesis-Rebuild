import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoFlow Pulse',
  description: 'AI-powered automation platform that helps small e-commerce businesses optimize their supply chain for sustainability while reducing costs through intelligent vendor matching and carbon footprint tracking. Transforms complex sustainability compliance into automated workflows with real-time cost savings alerts and eco-certification generation.',
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
