import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RetentionBot AI',
  description: 'AI-powered customer retention automation platform that analyzes e-commerce customer behavior and automatically generates personalized re-engagement campaigns, recovery emails, and loyalty content. Combines health & wellness psychology principles with AI automation to reduce churn by 40% for online businesses.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">RetentionBot AI</h1>
      <p className="mt-4 text-lg">AI-powered customer retention automation platform that analyzes e-commerce customer behavior and automatically generates personalized re-engagement campaigns, recovery emails, and loyalty content. Combines health & wellness psychology principles with AI automation to reduce churn by 40% for online businesses.</p>
    </main>
  )
}
