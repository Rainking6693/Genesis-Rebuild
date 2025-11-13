import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcoSpend Tracker',
  description: 'AI-powered personal finance app that automatically tracks your carbon footprint per purchase and helps you make climate-conscious spending decisions while improving your mental wellness through guilt-free budgeting. Users earn 'green credits' for sustainable purchases that unlock exclusive discounts at eco-friendly partner brands.',
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
