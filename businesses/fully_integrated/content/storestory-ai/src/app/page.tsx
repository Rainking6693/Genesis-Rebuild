import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'StoreStory AI',
  description: 'AI-powered platform that automatically generates compelling product stories, brand narratives, and marketing copy for e-commerce stores by analyzing product data, customer reviews, and market trends. Transforms boring product listings into engaging stories that convert browsers into buyers through emotional connection and social proof.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">StoreStory AI</h1>
      <p className="mt-4 text-lg">AI-powered platform that automatically generates compelling product stories, brand narratives, and marketing copy for e-commerce stores by analyzing product data, customer reviews, and market trends. Transforms boring product listings into engaging stories that convert browsers into buyers through emotional connection and social proof.</p>
    </main>
  )
}
