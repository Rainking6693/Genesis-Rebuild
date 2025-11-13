import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MoodCart AI',
  description: 'AI-powered emotional commerce platform that analyzes customer mood patterns to optimize product recommendations and reduce impulse purchase regret. Helps e-commerce businesses increase customer satisfaction and lifetime value by matching products to emotional states and providing post-purchase wellness tracking.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MoodCart AI</h1>
      <p className="mt-4 text-lg">AI-powered emotional commerce platform that analyzes customer mood patterns to optimize product recommendations and reduce impulse purchase regret. Helps e-commerce businesses increase customer satisfaction and lifetime value by matching products to emotional states and providing post-purchase wellness tracking.</p>
    </main>
  )
}
