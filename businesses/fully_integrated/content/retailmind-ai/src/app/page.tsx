import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RetailMind AI',
  description: 'AI-powered content automation platform that generates personalized product descriptions, email campaigns, and social media content for e-commerce brands by analyzing customer behavior and competitor strategies. Combines community-driven templates with AI automation to help small e-commerce businesses create converting content at scale without hiring expensive copywriters.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">RetailMind AI</h1>
      <p className="mt-4 text-lg">AI-powered content automation platform that generates personalized product descriptions, email campaigns, and social media content for e-commerce brands by analyzing customer behavior and competitor strategies. Combines community-driven templates with AI automation to help small e-commerce businesses create converting content at scale without hiring expensive copywriters.</p>
    </main>
  )
}
