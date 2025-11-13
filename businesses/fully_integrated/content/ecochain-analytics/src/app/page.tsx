import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoChain Analytics',
  description: 'AI-powered sustainability tracking platform that generates automated compliance reports and carbon footprint analytics for small e-commerce businesses using blockchain verification. We turn complex environmental data into actionable insights and marketing content that helps businesses meet regulations while attracting eco-conscious customers.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoChain Analytics</h1>
      <p className="mt-4 text-lg">AI-powered sustainability tracking platform that generates automated compliance reports and carbon footprint analytics for small e-commerce businesses using blockchain verification. We turn complex environmental data into actionable insights and marketing content that helps businesses meet regulations while attracting eco-conscious customers.</p>
    </main>
  )
}
