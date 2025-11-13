import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PitchStack',
  description: 'AI-powered platform that automatically generates personalized sales pitch decks and follow-up sequences by analyzing prospect data from LinkedIn, company websites, and CRM integrations. Transforms generic sales outreach into hyper-personalized presentations that convert 3x better than traditional approaches.',
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
