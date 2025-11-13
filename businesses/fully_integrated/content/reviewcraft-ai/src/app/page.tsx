import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ReviewCraft AI',
  description: 'AI-powered platform that automatically generates authentic, compliant customer review responses and follow-up sequences for small businesses. Combines sentiment analysis with brand voice training to create personalized responses that boost customer retention and online reputation.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ReviewCraft AI</h1>
      <p className="mt-4 text-lg">AI-powered platform that automatically generates authentic, compliant customer review responses and follow-up sequences for small businesses. Combines sentiment analysis with brand voice training to create personalized responses that boost customer retention and online reputation.</p>
    </main>
  )
}
