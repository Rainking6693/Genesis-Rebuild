import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoStory Studio',
  description: 'AI-powered platform that transforms small businesses' sustainability efforts into compelling, personalized content campaigns across multiple formats. Combines sustainability tracking with automated storytelling to help eco-conscious brands build authentic narratives that drive customer engagement and sales.',
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
