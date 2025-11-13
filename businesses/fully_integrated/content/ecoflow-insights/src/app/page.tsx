import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoFlow Insights',
  description: 'AI-powered sustainability analytics platform that generates automated carbon footprint reports and actionable reduction strategies for e-commerce businesses. Combines real-time supply chain data with expert sustainability content to help online retailers meet ESG goals and attract eco-conscious consumers.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoFlow Insights</h1>
      <p className="mt-4 text-lg">AI-powered sustainability analytics platform that generates automated carbon footprint reports and actionable reduction strategies for e-commerce businesses. Combines real-time supply chain data with expert sustainability content to help online retailers meet ESG goals and attract eco-conscious consumers.</p>
    </main>
  )
}
