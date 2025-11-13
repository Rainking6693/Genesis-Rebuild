import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RetentionGenius',
  description: 'AI-powered customer retention automation platform that predicts churn risk and automatically deploys personalized re-engagement campaigns across email, SMS, and social channels. Combines behavioral analytics with GPT-powered content generation to create hyper-personalized retention sequences that adapt in real-time based on customer responses.',
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
