import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GreenShift Analytics',
  description: 'AI-powered sustainability tracking platform that helps small e-commerce businesses automatically calculate, reduce, and market their carbon footprint while turning green initiatives into competitive advantages. Transform environmental compliance from a cost center into a profit driver through automated sustainability reporting and customer-facing green badges.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">GreenShift Analytics</h1>
      <p className="mt-4 text-lg">AI-powered sustainability tracking platform that helps small e-commerce businesses automatically calculate, reduce, and market their carbon footprint while turning green initiatives into competitive advantages. Transform environmental compliance from a cost center into a profit driver through automated sustainability reporting and customer-facing green badges.</p>
    </main>
  )
}
