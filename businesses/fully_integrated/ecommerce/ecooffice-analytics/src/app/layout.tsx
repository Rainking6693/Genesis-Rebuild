import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoOffice Analytics',
  description: 'AI-powered platform that helps remote teams track, reduce, and offset their distributed carbon footprint while boosting employee engagement through gamified sustainability challenges. Combines real-time environmental impact tracking with team wellness features and automated carbon offset purchasing.',
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
