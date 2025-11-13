import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CarbonClaim',
  description: 'AI-powered platform that automatically calculates and offsets the carbon footprint of every ecommerce transaction, turning sustainability into a competitive advantage for online stores. Customers receive instant carbon-neutral certificates and businesses get detailed emissions analytics to optimize their supply chain.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CarbonClaim</h1>
      <p className="mt-4 text-lg">AI-powered platform that automatically calculates and offsets the carbon footprint of every ecommerce transaction, turning sustainability into a competitive advantage for online stores. Customers receive instant carbon-neutral certificates and businesses get detailed emissions analytics to optimize their supply chain.</p>
    </main>
  )
}
