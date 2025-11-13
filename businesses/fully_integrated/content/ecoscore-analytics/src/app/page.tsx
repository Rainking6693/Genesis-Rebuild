import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoScore Analytics',
  description: 'AI-powered sustainability analytics platform that automatically tracks, scores, and optimizes small businesses' environmental impact while generating compliance reports and customer-facing eco-credentials. Combines climate tech with automation to turn sustainability from a cost center into a competitive advantage and revenue driver.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoScore Analytics</h1>
      <p className="mt-4 text-lg">AI-powered sustainability analytics platform that automatically tracks, scores, and optimizes small businesses' environmental impact while generating compliance reports and customer-facing eco-credentials. Combines climate tech with automation to turn sustainability from a cost center into a competitive advantage and revenue driver.</p>
    </main>
  )
}
