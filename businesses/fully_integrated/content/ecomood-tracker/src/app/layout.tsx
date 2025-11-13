import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoMood Tracker',
  description: 'A mental wellness platform that connects daily mood patterns with environmental data, helping remote workers and climate-conscious professionals understand how air quality, weather, and sustainability actions impact their productivity and mental health. Users receive personalized content, challenges, and workspace optimization tips based on their unique environmental-mood correlations.',
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
