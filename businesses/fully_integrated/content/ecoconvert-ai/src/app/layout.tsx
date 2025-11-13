import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoConvert AI',
  description: 'AI-powered platform that automatically generates personalized sustainability action plans and ROI calculators for e-commerce businesses, turning climate compliance from a cost center into a profit driver. Creates viral sustainability scorecards that customers can share, driving organic growth while helping businesses reduce costs and attract eco-conscious buyers.',
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
