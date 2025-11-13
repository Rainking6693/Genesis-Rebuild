import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PolicyPulse AI',
  description: 'AI-powered micro-SaaS that automatically tracks, analyzes, and translates complex industry regulations into actionable compliance checklists for small businesses. Delivers personalized regulatory updates via smart notifications and generates audit-ready documentation with zero manual input.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">PolicyPulse AI</h1>
      <p className="mt-4 text-lg">AI-powered micro-SaaS that automatically tracks, analyzes, and translates complex industry regulations into actionable compliance checklists for small businesses. Delivers personalized regulatory updates via smart notifications and generates audit-ready documentation with zero manual input.</p>
    </main>
  )
}
