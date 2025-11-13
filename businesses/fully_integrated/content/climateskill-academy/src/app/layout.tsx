import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ClimateSkill Academy',
  description: 'AI-powered microlearning platform that delivers bite-sized, role-specific climate action training for employees, helping companies build sustainability expertise while meeting ESG compliance requirements. Each 5-minute daily lesson is personalized by job function and includes practical implementation steps with progress tracking.',
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
