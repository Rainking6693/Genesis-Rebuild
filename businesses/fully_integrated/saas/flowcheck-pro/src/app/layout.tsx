import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FlowCheck Pro',
  description: 'AI-powered workflow automation platform that monitors employee burnout signals in real-time and automatically suggests micro-interventions to boost productivity and retention. Combines health & wellness monitoring with productivity optimization through smart calendar analysis, communication patterns, and workload distribution.',
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
