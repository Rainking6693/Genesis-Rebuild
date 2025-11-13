import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoStory',
  description: 'AI-powered platform that auto-generates authentic sustainability stories and impact reports for small e-commerce brands using their actual business data. Helps brands build trust with eco-conscious consumers through personalized, data-driven sustainability narratives without greenwashing.',
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
