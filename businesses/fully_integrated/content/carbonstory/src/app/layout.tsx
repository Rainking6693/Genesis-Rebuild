import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CarbonStory',
  description: 'AI-powered platform that automatically generates personalized sustainability impact reports and shareable content for e-commerce purchases, helping consumers track their carbon footprint while enabling brands to showcase their green initiatives. Transforms boring ESG data into engaging, viral-ready stories that drive both consumer awareness and brand loyalty.',
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
