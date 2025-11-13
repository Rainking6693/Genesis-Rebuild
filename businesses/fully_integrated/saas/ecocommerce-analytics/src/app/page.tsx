import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoCommerce Analytics',
  description: 'AI-powered sustainability scoring and carbon tracking platform that helps e-commerce businesses automatically calculate, display, and offset their products' environmental impact while boosting green sales conversions. Combines real-time supply chain data with consumer sustainability preferences to drive profitable eco-conscious purchasing decisions.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoCommerce Analytics</h1>
      <p className="mt-4 text-lg">AI-powered sustainability scoring and carbon tracking platform that helps e-commerce businesses automatically calculate, display, and offset their products' environmental impact while boosting green sales conversions. Combines real-time supply chain data with consumer sustainability preferences to drive profitable eco-conscious purchasing decisions.</p>
    </main>
  )
}
