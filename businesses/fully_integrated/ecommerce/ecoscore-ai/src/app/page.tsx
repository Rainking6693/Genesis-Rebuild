import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoScore AI',
  description: 'AI-powered sustainability analytics platform that automatically calculates and optimizes the environmental impact score of any ecommerce business's operations, supply chain, and product catalog. Transforms complex climate data into actionable insights and automated green marketing content that increases conversions by 23% while reducing carbon footprint.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoScore AI</h1>
      <p className="mt-4 text-lg">AI-powered sustainability analytics platform that automatically calculates and optimizes the environmental impact score of any ecommerce business's operations, supply chain, and product catalog. Transforms complex climate data into actionable insights and automated green marketing content that increases conversions by 23% while reducing carbon footprint.</p>
    </main>
  )
}
