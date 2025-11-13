import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WellnessHub Pro',
  description: 'AI-powered employee wellness platform that combines mental health check-ins, personalized wellness content, and team community features to reduce burnout and increase productivity in small businesses. Automatically generates wellness reports and intervention recommendations for HR teams while creating peer support networks among employees.',
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
