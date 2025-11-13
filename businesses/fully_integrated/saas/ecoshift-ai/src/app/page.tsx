import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoShift AI',
  description: 'AI-powered sustainability automation platform that helps small e-commerce businesses automatically calculate, offset, and market their carbon footprint while turning green initiatives into customer acquisition tools. Combines real-time carbon tracking with automated marketing campaigns that showcase environmental impact to boost sales and customer loyalty.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoShift AI</h1>
      <p className="mt-4 text-lg">AI-powered sustainability automation platform that helps small e-commerce businesses automatically calculate, offset, and market their carbon footprint while turning green initiatives into customer acquisition tools. Combines real-time carbon tracking with automated marketing campaigns that showcase environmental impact to boost sales and customer loyalty.</p>
    </main>
  )
}
