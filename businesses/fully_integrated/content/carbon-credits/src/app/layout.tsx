import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Carbon Credits',
  description: 'AI-powered platform that automatically generates personalized carbon offset content and marketing materials for small e-commerce businesses to showcase their sustainability efforts. Combines climate tech with creator economy tools to help businesses build authentic green brands through automated storytelling and customer engagement.',
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
