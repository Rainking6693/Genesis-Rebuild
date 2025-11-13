import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Carbon Basket',
  description: 'AI-powered micro-SaaS that automatically calculates and offsets the carbon footprint of every e-commerce purchase in real-time, turning eco-anxiety into actionable climate impact. Seamlessly integrates with any online store to provide customers instant carbon transparency and one-click offset purchasing at checkout.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Carbon Basket</h1>
      <p className="mt-4 text-lg">AI-powered micro-SaaS that automatically calculates and offsets the carbon footprint of every e-commerce purchase in real-time, turning eco-anxiety into actionable climate impact. Seamlessly integrates with any online store to provide customers instant carbon transparency and one-click offset purchasing at checkout.</p>
    </main>
  )
}
