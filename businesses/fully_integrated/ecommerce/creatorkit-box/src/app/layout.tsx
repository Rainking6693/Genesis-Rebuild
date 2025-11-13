import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CreatorKit Box',
  description: 'AI-curated monthly subscription boxes containing trending products from independent creators, paired with exclusive digital content and early access to launches. Each box targets specific niches (productivity, wellness, tech, etc.) and uses machine learning to personalize selections based on member preferences and creator performance data.',
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
