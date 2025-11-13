import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CarbonCarts',
  description: 'AI-powered carbon footprint tracking for e-commerce purchases that gamifies sustainable shopping with rewards and team challenges. Helps conscious consumers and remote teams make eco-friendly buying decisions while earning points redeemable for carbon offsets or sustainable products.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CarbonCarts</h1>
      <p className="mt-4 text-lg">AI-powered carbon footprint tracking for e-commerce purchases that gamifies sustainable shopping with rewards and team challenges. Helps conscious consumers and remote teams make eco-friendly buying decisions while earning points redeemable for carbon offsets or sustainable products.</p>
    </main>
  )
}
