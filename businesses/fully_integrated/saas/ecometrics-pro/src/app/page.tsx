import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoMetrics Pro',
  description: 'AI-powered sustainability tracking platform that automatically calculates and optimizes carbon footprints for small e-commerce businesses while generating customer-facing eco-badges and reports. Combines climate tech with e-commerce automation to turn environmental compliance into a competitive advantage and marketing tool.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoMetrics Pro</h1>
      <p className="mt-4 text-lg">AI-powered sustainability tracking platform that automatically calculates and optimizes carbon footprints for small e-commerce businesses while generating customer-facing eco-badges and reports. Combines climate tech with e-commerce automation to turn environmental compliance into a competitive advantage and marketing tool.</p>
    </main>
  )
}
