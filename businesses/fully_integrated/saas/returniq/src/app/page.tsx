import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ReturnIQ',
  description: 'AI-powered return management platform that transforms product returns into customer retention opportunities through personalized exchanges, instant store credits, and predictive analytics. Helps e-commerce businesses reduce return costs by 40% while increasing customer lifetime value through smart retention workflows.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ReturnIQ</h1>
      <p className="mt-4 text-lg">AI-powered return management platform that transforms product returns into customer retention opportunities through personalized exchanges, instant store credits, and predictive analytics. Helps e-commerce businesses reduce return costs by 40% while increasing customer lifetime value through smart retention workflows.</p>
    </main>
  )
}
