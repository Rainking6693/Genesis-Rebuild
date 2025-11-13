import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ReturnFlow AI',
  description: 'AI-powered return management platform that transforms product returns into personalized upsell opportunities while automating sustainable disposal through local donation networks. Converts cost centers into profit drivers by intelligently routing returned items to charity tax deductions, resale channels, or refurbishment partners.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ReturnFlow AI</h1>
      <p className="mt-4 text-lg">AI-powered return management platform that transforms product returns into personalized upsell opportunities while automating sustainable disposal through local donation networks. Converts cost centers into profit drivers by intelligently routing returned items to charity tax deductions, resale channels, or refurbishment partners.</p>
    </main>
  )
}
