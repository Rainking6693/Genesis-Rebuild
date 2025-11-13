import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ReviewBoost AI',
  description: 'AI-powered review management platform that automatically generates personalized response templates and sentiment analysis for small e-commerce businesses. Combines community insights with mental health-conscious customer service to turn negative reviews into loyal customers through empathetic, data-driven responses.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ReviewBoost AI</h1>
      <p className="mt-4 text-lg">AI-powered review management platform that automatically generates personalized response templates and sentiment analysis for small e-commerce businesses. Combines community insights with mental health-conscious customer service to turn negative reviews into loyal customers through empathetic, data-driven responses.</p>
    </main>
  )
}
