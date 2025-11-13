import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SpendSense AI',
  description: 'AI-powered expense intelligence platform that automatically categorizes business receipts, predicts cash flow, and creates financial reports while building a community marketplace where small businesses can share and sell their anonymized spending insights to vendors and service providers. It combines personal finance automation with Web3-style data monetization, letting businesses earn passive income from their spending patterns.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">SpendSense AI</h1>
      <p className="mt-4 text-lg">AI-powered expense intelligence platform that automatically categorizes business receipts, predicts cash flow, and creates financial reports while building a community marketplace where small businesses can share and sell their anonymized spending insights to vendors and service providers. It combines personal finance automation with Web3-style data monetization, letting businesses earn passive income from their spending patterns.</p>
    </main>
  )
}
