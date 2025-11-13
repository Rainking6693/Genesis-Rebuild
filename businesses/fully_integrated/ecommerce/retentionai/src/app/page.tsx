import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RetentionAI',
  description: 'AI-powered customer retention platform that automatically generates personalized win-back campaigns for ecommerce businesses based on real-time behavioral analysis. Combines community insights from similar businesses with AI-driven automation to recover churning customers before they're lost forever.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">RetentionAI</h1>
      <p className="mt-4 text-lg">AI-powered customer retention platform that automatically generates personalized win-back campaigns for ecommerce businesses based on real-time behavioral analysis. Combines community insights from similar businesses with AI-driven automation to recover churning customers before they're lost forever.</p>
    </main>
  )
}
