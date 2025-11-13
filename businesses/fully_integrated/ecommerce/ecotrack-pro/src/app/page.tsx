import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoTrack Pro',
  description: 'AI-powered sustainability dashboard that automatically tracks and offsets the carbon footprint of small business operations, purchases, and shipping in real-time. Transforms compliance headaches into competitive advantages by generating automated ESG reports and customer-facing sustainability badges.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoTrack Pro</h1>
      <p className="mt-4 text-lg">AI-powered sustainability dashboard that automatically tracks and offsets the carbon footprint of small business operations, purchases, and shipping in real-time. Transforms compliance headaches into competitive advantages by generating automated ESG reports and customer-facing sustainability badges.</p>
    </main>
  )
}
