import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MeetingMiner',
  description: 'AI-powered platform that automatically extracts actionable business insights from remote team meetings and converts them into trackable tasks, knowledge base articles, and competitive intelligence reports. Think of it as your team's automated business analyst that never misses a detail and helps small businesses turn meeting discussions into strategic advantage.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MeetingMiner</h1>
      <p className="mt-4 text-lg">AI-powered platform that automatically extracts actionable business insights from remote team meetings and converts them into trackable tasks, knowledge base articles, and competitive intelligence reports. Think of it as your team's automated business analyst that never misses a detail and helps small businesses turn meeting discussions into strategic advantage.</p>
    </main>
  )
}
