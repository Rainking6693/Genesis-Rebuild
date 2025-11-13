import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MindFlow Labs',
  description: 'AI-powered mental wellness platform that creates personalized productivity rituals by combining cognitive behavioral therapy techniques with workflow optimization for remote teams. Delivers bite-sized, science-backed content modules that improve both individual mental health and team performance metrics.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MindFlow Labs</h1>
      <p className="mt-4 text-lg">AI-powered mental wellness platform that creates personalized productivity rituals by combining cognitive behavioral therapy techniques with workflow optimization for remote teams. Delivers bite-sized, science-backed content modules that improve both individual mental health and team performance metrics.</p>
    </main>
  )
}
