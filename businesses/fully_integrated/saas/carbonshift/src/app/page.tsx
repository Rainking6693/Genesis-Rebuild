import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CarbonShift',
  description: 'AI-powered carbon footprint tracker for e-commerce businesses that automatically calculates emissions from supply chain activities and provides actionable sustainability recommendations. Helps online retailers meet ESG goals while attracting eco-conscious customers through transparent carbon impact reporting.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CarbonShift</h1>
      <p className="mt-4 text-lg">AI-powered carbon footprint tracker for e-commerce businesses that automatically calculates emissions from supply chain activities and provides actionable sustainability recommendations. Helps online retailers meet ESG goals while attracting eco-conscious customers through transparent carbon impact reporting.</p>
    </main>
  )
}
