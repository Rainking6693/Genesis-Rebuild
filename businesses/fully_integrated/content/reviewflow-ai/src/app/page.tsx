import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ReviewFlow AI',
  description: 'AI-powered platform that automatically generates personalized review response templates and sentiment-driven marketing content for small businesses based on their customer feedback patterns. Transforms negative reviews into retention opportunities and positive reviews into viral social media content.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ReviewFlow AI</h1>
      <p className="mt-4 text-lg">AI-powered platform that automatically generates personalized review response templates and sentiment-driven marketing content for small businesses based on their customer feedback patterns. Transforms negative reviews into retention opportunities and positive reviews into viral social media content.</p>
    </main>
  )
}
