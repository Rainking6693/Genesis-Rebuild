import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoHR Pulse',
  description: 'AI-powered platform that helps remote teams build sustainable work habits while tracking their collective environmental impact through gamified challenges and expert-curated content. Combines mental wellness, climate action, and team building into one engaging SaaS solution for distributed workforces.',
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
