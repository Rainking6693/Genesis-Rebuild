import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ClimateCommit',
  description: 'An AI-powered community platform that helps small businesses automatically track, offset, and showcase their carbon footprint while building customer loyalty through transparent sustainability actions. Businesses get real-time ESG scoring, automated carbon offset purchasing, and community-driven sustainability challenges that customers can participate in.',
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
