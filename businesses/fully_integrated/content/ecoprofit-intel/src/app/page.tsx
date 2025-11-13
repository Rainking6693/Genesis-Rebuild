import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoProfit Intel',
  description: 'AI-powered platform that analyzes e-commerce businesses and generates personalized sustainability reports with actionable profit-boosting recommendations. Combines real-time market data, carbon footprint analysis, and consumer behavior insights to help online retailers increase revenue while meeting growing eco-conscious demand.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoProfit Intel</h1>
      <p className="mt-4 text-lg">AI-powered platform that analyzes e-commerce businesses and generates personalized sustainability reports with actionable profit-boosting recommendations. Combines real-time market data, carbon footprint analysis, and consumer behavior insights to help online retailers increase revenue while meeting growing eco-conscious demand.</p>
    </main>
  )
}
