import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoSpend AI',
  description: 'AI-powered expense tracking that automatically categorizes business purchases by their carbon footprint and suggests eco-friendly alternatives to reduce costs and environmental impact. Combines personal finance automation with climate action insights, helping small businesses save money while meeting sustainability goals.',
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
