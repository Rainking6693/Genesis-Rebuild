import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MindFlow Labs',
  description: 'AI-powered mental wellness automation platform that creates personalized stress-reduction workflows for remote teams and small businesses. Combines employee mental health tracking with automated intervention suggestions and sustainable wellness product recommendations.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MindFlow Labs</h1>
      <p className="mt-4 text-lg">AI-powered mental wellness automation platform that creates personalized stress-reduction workflows for remote teams and small businesses. Combines employee mental health tracking with automated intervention suggestions and sustainable wellness product recommendations.</p>
    </main>
  )
}
