import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MoodSpace',
  description: 'AI-powered workspace environment optimization platform that analyzes remote workers' productivity patterns and automatically suggests/sells personalized workspace products, lighting, and wellness tools. Combines mental health insights with e-commerce recommendations to create the perfect productive home office environment.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MoodSpace</h1>
      <p className="mt-4 text-lg">AI-powered workspace environment optimization platform that analyzes remote workers' productivity patterns and automatically suggests/sells personalized workspace products, lighting, and wellness tools. Combines mental health insights with e-commerce recommendations to create the perfect productive home office environment.</p>
    </main>
  )
}
