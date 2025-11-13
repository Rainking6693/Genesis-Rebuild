import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FlowCraft',
  description: 'A no-code automation marketplace where small businesses can instantly purchase, customize, and deploy pre-built workflow automations created by expert automation builders. Think 'Shopify themes but for business processes' - businesses get instant productivity solutions while creators earn recurring revenue from their automation templates.',
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
