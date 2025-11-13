import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Climate Pitch',
  description: 'AI-powered platform that generates personalized sustainability reports and carbon reduction roadmaps for small businesses, packaged as professional presentations for client meetings and investor pitches. Combines climate tech insights with creator economy tools to help businesses showcase their environmental impact and attract eco-conscious customers.',
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
