import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoScore Pro',
  description: 'AI-powered sustainability analytics platform that automatically tracks and scores small businesses' environmental impact across operations, supply chain, and customer engagement. Transforms complex sustainability data into actionable insights and customer-facing transparency reports that boost brand trust and sales.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoScore Pro</h1>
      <p className="mt-4 text-lg">AI-powered sustainability analytics platform that automatically tracks and scores small businesses' environmental impact across operations, supply chain, and customer engagement. Transforms complex sustainability data into actionable insights and customer-facing transparency reports that boost brand trust and sales.</p>
    </main>
  )
}
