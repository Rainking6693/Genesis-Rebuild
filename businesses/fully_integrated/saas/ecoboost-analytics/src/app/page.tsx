import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoBoost Analytics',
  description: 'AI-powered sustainability analytics platform that automatically tracks and optimizes e-commerce businesses' carbon footprint while providing customers with real-time environmental impact scores at checkout. Transforms environmental compliance from a cost center into a competitive advantage that drives customer loyalty and premium pricing.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoBoost Analytics</h1>
      <p className="mt-4 text-lg">AI-powered sustainability analytics platform that automatically tracks and optimizes e-commerce businesses' carbon footprint while providing customers with real-time environmental impact scores at checkout. Transforms environmental compliance from a cost center into a competitive advantage that drives customer loyalty and premium pricing.</p>
    </main>
  )
}
