import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CarbonTrail Pro',
  description: 'AI-powered carbon footprint tracking SaaS that automatically calculates and offsets small businesses' environmental impact through real-time integrations with their existing tools. Transforms compliance headaches into competitive advantages with automated ESG reporting and customer-facing sustainability badges.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CarbonTrail Pro</h1>
      <p className="mt-4 text-lg">AI-powered carbon footprint tracking SaaS that automatically calculates and offsets small businesses' environmental impact through real-time integrations with their existing tools. Transforms compliance headaches into competitive advantages with automated ESG reporting and customer-facing sustainability badges.</p>
    </main>
  )
}
