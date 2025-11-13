import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoMerge Analytics',
  description: 'AI-powered sustainability analytics platform that automatically tracks, scores, and optimizes the environmental impact of small business operations while generating compliance reports and carbon offset recommendations. Turns climate responsibility into a competitive advantage with automated ESG reporting and customer-facing sustainability badges.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoMerge Analytics</h1>
      <p className="mt-4 text-lg">AI-powered sustainability analytics platform that automatically tracks, scores, and optimizes the environmental impact of small business operations while generating compliance reports and carbon offset recommendations. Turns climate responsibility into a competitive advantage with automated ESG reporting and customer-facing sustainability badges.</p>
    </main>
  )
}
