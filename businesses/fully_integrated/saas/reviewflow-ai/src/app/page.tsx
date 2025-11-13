import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ReviewFlow AI',
  description: 'AI-powered review management platform that automatically generates personalized response templates for customer reviews across all platforms, then learns from business owner edits to improve future responses. Transforms review management from a 2-hour daily task into a 10-minute approval process while maintaining authentic brand voice.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ReviewFlow AI</h1>
      <p className="mt-4 text-lg">AI-powered review management platform that automatically generates personalized response templates for customer reviews across all platforms, then learns from business owner edits to improve future responses. Transforms review management from a 2-hour daily task into a 10-minute approval process while maintaining authentic brand voice.</p>
    </main>
  )
}
