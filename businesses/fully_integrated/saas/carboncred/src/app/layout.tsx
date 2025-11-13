import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CarbonCred',
  description: 'AI-powered platform that automatically tracks e-commerce businesses' carbon footprint and converts it into verified carbon credits they can sell or use for marketing. Small online businesses get instant sustainability insights plus a new revenue stream by monetizing their green initiatives through automated carbon credit generation.',
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
