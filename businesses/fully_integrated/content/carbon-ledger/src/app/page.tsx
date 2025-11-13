import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Carbon Ledger',
  description: 'AI-powered platform that automatically tracks, verifies, and showcases small businesses' sustainability efforts through real-time carbon accounting and customer-facing impact stories. Transforms compliance headaches into marketing gold by generating authentic sustainability content that drives customer loyalty and premium pricing.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Carbon Ledger</h1>
      <p className="mt-4 text-lg">AI-powered platform that automatically tracks, verifies, and showcases small businesses' sustainability efforts through real-time carbon accounting and customer-facing impact stories. Transforms compliance headaches into marketing gold by generating authentic sustainability content that drives customer loyalty and premium pricing.</p>
    </main>
  )
}
