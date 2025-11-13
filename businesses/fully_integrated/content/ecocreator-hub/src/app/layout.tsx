import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoCreator Hub',
  description: 'AI-powered platform that helps content creators monetize sustainability expertise by generating data-driven climate impact content and connecting them with eco-conscious brands for sponsored partnerships. Creators upload their sustainability knowledge once, and our AI transforms it into multiple content formats while tracking real environmental impact metrics for brand collaborations.',
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
