import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ReturnSense',
  description: 'AI-powered micro-SaaS that transforms e-commerce return data into actionable content strategies and customer retention playbooks. Helps online stores turn their biggest cost center (returns) into competitive intelligence and personalized shopping experiences.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ReturnSense</h1>
      <p className="mt-4 text-lg">AI-powered micro-SaaS that transforms e-commerce return data into actionable content strategies and customer retention playbooks. Helps online stores turn their biggest cost center (returns) into competitive intelligence and personalized shopping experiences.</p>
    </main>
  )
}
