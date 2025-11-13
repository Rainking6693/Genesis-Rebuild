import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SustainFlow',
  description: 'AI-powered sustainability compliance automation platform that helps e-commerce businesses automatically track, report, and optimize their carbon footprint while generating customer-facing sustainability scores. Turns regulatory burden into competitive advantage by creating automated ESG reports and customer trust signals that increase conversion rates.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">SustainFlow</h1>
      <p className="mt-4 text-lg">AI-powered sustainability compliance automation platform that helps e-commerce businesses automatically track, report, and optimize their carbon footprint while generating customer-facing sustainability scores. Turns regulatory burden into competitive advantage by creating automated ESG reports and customer trust signals that increase conversion rates.</p>
    </main>
  )
}
