import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ClimateHire',
  description: 'AI-powered recruitment platform that matches climate-conscious professionals with sustainability-focused roles at companies with verified ESG credentials. We solve the disconnect between talented professionals wanting meaningful climate work and companies struggling to attract purpose-driven talent in the green economy.',
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
