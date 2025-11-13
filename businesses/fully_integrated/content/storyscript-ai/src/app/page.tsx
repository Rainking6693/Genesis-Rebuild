import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'StoryScript AI',
  description: 'An AI-powered no-code platform that transforms business data and processes into engaging video narratives for marketing and training. Small businesses upload their workflows, customer journeys, or product data, and our AI generates compelling story-driven video content with professional voiceovers and animations.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">StoryScript AI</h1>
      <p className="mt-4 text-lg">An AI-powered no-code platform that transforms business data and processes into engaging video narratives for marketing and training. Small businesses upload their workflows, customer journeys, or product data, and our AI generates compelling story-driven video content with professional voiceovers and animations.</p>
    </main>
  )
}
