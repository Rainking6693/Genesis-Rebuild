import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MoodMail AI',
  description: 'AI-powered email marketing platform that analyzes customer sentiment and mental health indicators to automatically adjust email tone, timing, and content for maximum engagement and wellness-conscious communication. Helps e-commerce brands build deeper emotional connections while respecting customer mental health boundaries.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MoodMail AI</h1>
      <p className="mt-4 text-lg">AI-powered email marketing platform that analyzes customer sentiment and mental health indicators to automatically adjust email tone, timing, and content for maximum engagement and wellness-conscious communication. Helps e-commerce brands build deeper emotional connections while respecting customer mental health boundaries.</p>
    </main>
  )
}
