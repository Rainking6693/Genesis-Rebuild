import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoFlow Analytics',
  description: 'AI-powered sustainability tracking platform that automatically calculates and optimizes carbon footprints for small e-commerce businesses while generating customer-facing eco-impact reports. Turns environmental compliance into a competitive advantage by creating personalized sustainability stories that drive customer loyalty and premium pricing.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoFlow Analytics</h1>
      <p className="mt-4 text-lg">AI-powered sustainability tracking platform that automatically calculates and optimizes carbon footprints for small e-commerce businesses while generating customer-facing eco-impact reports. Turns environmental compliance into a competitive advantage by creating personalized sustainability stories that drive customer loyalty and premium pricing.</p>
    </main>
  )
}
