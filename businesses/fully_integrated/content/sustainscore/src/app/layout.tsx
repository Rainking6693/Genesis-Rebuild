import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SustainScore',
  description: 'AI-powered sustainability assessment platform that generates detailed environmental impact reports and improvement roadmaps for small businesses within minutes. We transform complex ESG compliance into actionable, automated insights that help businesses reduce costs while meeting growing sustainability demands from customers and partners.',
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
