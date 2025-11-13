import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoShift Analytics',
  description: 'AI-powered sustainability analytics platform that helps small e-commerce businesses automatically track, optimize, and market their carbon footprint to eco-conscious customers. Transform environmental compliance from a cost center into a competitive advantage and revenue driver through automated sustainability scoring and customer-facing eco-badges.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoShift Analytics</h1>
      <p className="mt-4 text-lg">AI-powered sustainability analytics platform that helps small e-commerce businesses automatically track, optimize, and market their carbon footprint to eco-conscious customers. Transform environmental compliance from a cost center into a competitive advantage and revenue driver through automated sustainability scoring and customer-facing eco-badges.</p>
    </main>
  )
}
