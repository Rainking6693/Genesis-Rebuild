import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Review Rocket',
  description: 'AI-powered review management platform that automatically generates personalized review request campaigns and optimizes timing based on customer behavior patterns. Transforms customer feedback into a powerful growth engine for e-commerce businesses through intelligent automation.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Review Rocket</h1>
      <p className="mt-4 text-lg">AI-powered review management platform that automatically generates personalized review request campaigns and optimizes timing based on customer behavior patterns. Transforms customer feedback into a powerful growth engine for e-commerce businesses through intelligent automation.</p>
    </main>
  )
}
