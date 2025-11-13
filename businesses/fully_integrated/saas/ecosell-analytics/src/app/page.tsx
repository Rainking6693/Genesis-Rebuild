import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoSell Analytics',
  description: 'AI-powered sustainability analytics platform that helps small e-commerce brands track, optimize, and market their environmental impact to eco-conscious consumers. Combines carbon footprint tracking with automated green marketing content generation and customer sustainability scoring.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoSell Analytics</h1>
      <p className="mt-4 text-lg">AI-powered sustainability analytics platform that helps small e-commerce brands track, optimize, and market their environmental impact to eco-conscious consumers. Combines carbon footprint tracking with automated green marketing content generation and customer sustainability scoring.</p>
    </main>
  )
}
