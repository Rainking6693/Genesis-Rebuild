import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoTrace AI',
  description: 'AI-powered carbon footprint tracking and automated offset marketplace that integrates with e-commerce stores to provide real-time sustainability insights and one-click carbon neutrality for every purchase. Combines climate tech with micro-SaaS automation to turn environmental responsibility into a competitive advantage for online retailers.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoTrace AI</h1>
      <p className="mt-4 text-lg">AI-powered carbon footprint tracking and automated offset marketplace that integrates with e-commerce stores to provide real-time sustainability insights and one-click carbon neutrality for every purchase. Combines climate tech with micro-SaaS automation to turn environmental responsibility into a competitive advantage for online retailers.</p>
    </main>
  )
}
