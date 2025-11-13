import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ClimateClerk',
  description: 'AI-powered carbon accounting and sustainability compliance platform that automatically tracks, calculates, and reports carbon emissions for small businesses through receipt scanning and API integrations. Transforms complex climate reporting into a simple monthly subscription with automated ESG reports that help businesses win more contracts and meet regulatory requirements.',
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
