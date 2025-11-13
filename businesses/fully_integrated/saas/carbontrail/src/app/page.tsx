import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CarbonTrail',
  description: 'AI-powered carbon footprint tracker specifically for e-commerce businesses that automatically calculates shipping emissions and suggests sustainable alternatives to increase customer loyalty. Integrates with major e-commerce platforms to provide real-time sustainability insights and customer-facing carbon offset options at checkout.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CarbonTrail</h1>
      <p className="mt-4 text-lg">AI-powered carbon footprint tracker specifically for e-commerce businesses that automatically calculates shipping emissions and suggests sustainable alternatives to increase customer loyalty. Integrates with major e-commerce platforms to provide real-time sustainability insights and customer-facing carbon offset options at checkout.</p>
    </main>
  )
}
