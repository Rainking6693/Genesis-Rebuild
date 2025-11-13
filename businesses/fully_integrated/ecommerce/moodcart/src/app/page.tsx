import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MoodCart',
  description: 'AI-powered wellness subscription platform that curates personalized product boxes based on users' real-time emotional states and mental health goals. Combines mood tracking with smart commerce to deliver exactly what customers need when they need it most.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MoodCart</h1>
      <p className="mt-4 text-lg">AI-powered wellness subscription platform that curates personalized product boxes based on users' real-time emotional states and mental health goals. Combines mood tracking with smart commerce to deliver exactly what customers need when they need it most.</p>
    </main>
  )
}
