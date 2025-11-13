import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CarbonCart',
  description: 'AI-powered sustainability analytics platform that helps e-commerce businesses automatically calculate, offset, and market their carbon footprint to environmentally conscious consumers. Transforms environmental compliance from a cost center into a competitive advantage and revenue driver through automated green marketing campaigns.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CarbonCart</h1>
      <p className="mt-4 text-lg">AI-powered sustainability analytics platform that helps e-commerce businesses automatically calculate, offset, and market their carbon footprint to environmentally conscious consumers. Transforms environmental compliance from a cost center into a competitive advantage and revenue driver through automated green marketing campaigns.</p>
    </main>
  )
}
