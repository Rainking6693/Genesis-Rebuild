import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'StoryBridge AI',
  description: 'AI-powered platform that transforms small business data and operations into compelling customer stories and case studies for marketing. Automatically generates testimonials, success stories, and social proof content by analyzing customer interactions, sales data, and support tickets.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">StoryBridge AI</h1>
      <p className="mt-4 text-lg">AI-powered platform that transforms small business data and operations into compelling customer stories and case studies for marketing. Automatically generates testimonials, success stories, and social proof content by analyzing customer interactions, sales data, and support tickets.</p>
    </main>
  )
}
