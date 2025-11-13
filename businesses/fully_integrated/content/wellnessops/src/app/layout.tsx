import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WellnessOps',
  description: 'AI-powered platform that creates personalized employee wellness content and automates health program delivery for small businesses. Combines workplace wellness trends with no-code automation to help companies boost productivity and reduce healthcare costs through data-driven wellness initiatives.',
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
