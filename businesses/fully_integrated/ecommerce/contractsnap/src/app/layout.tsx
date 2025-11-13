import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ContractSnap',
  description: 'AI-powered platform that instantly generates legally-compliant business contracts and agreements from simple conversational inputs, eliminating expensive lawyer consultations for routine documents. Users describe their needs in plain English, and our AI creates, customizes, and manages contract templates with automated reminders and e-signature workflows.',
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
