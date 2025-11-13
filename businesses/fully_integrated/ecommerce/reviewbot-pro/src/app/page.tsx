import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ReviewBot Pro',
  description: 'AI-powered review management platform that automatically generates personalized responses to customer reviews across all platforms while maintaining brand voice and sentiment analysis. Helps small businesses turn negative reviews into customer retention opportunities and amplify positive feedback through smart automation.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ReviewBot Pro</h1>
      <p className="mt-4 text-lg">AI-powered review management platform that automatically generates personalized responses to customer reviews across all platforms while maintaining brand voice and sentiment analysis. Helps small businesses turn negative reviews into customer retention opportunities and amplify positive feedback through smart automation.</p>
    </main>
  )
}
