import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Review Rocket',
  description: 'AI-powered review response automation platform that helps small businesses generate personalized, brand-consistent responses to customer reviews across all platforms in seconds. Combines sentiment analysis with custom brand voice training to turn negative reviews into customer retention opportunities while scaling positive engagement.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Review Rocket</h1>
      <p className="mt-4 text-lg">AI-powered review response automation platform that helps small businesses generate personalized, brand-consistent responses to customer reviews across all platforms in seconds. Combines sentiment analysis with custom brand voice training to turn negative reviews into customer retention opportunities while scaling positive engagement.</p>
    </main>
  )
}
