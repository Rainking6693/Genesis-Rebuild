import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'StressLens AI',
  description: 'AI-powered workplace stress analytics platform that automatically detects team burnout signals from digital communication patterns and generates personalized wellness content recommendations for managers. Combines mental health insights with AI productivity tools to prevent employee turnover before it happens.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">StressLens AI</h1>
      <p className="mt-4 text-lg">AI-powered workplace stress analytics platform that automatically detects team burnout signals from digital communication patterns and generates personalized wellness content recommendations for managers. Combines mental health insights with AI productivity tools to prevent employee turnover before it happens.</p>
    </main>
  )
}
