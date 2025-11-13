import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MindFlow Studio',
  description: 'AI-powered mental wellness content creation platform that helps remote teams generate personalized mindfulness sessions, stress-relief workshops, and team bonding activities. Combines mental health focus with creator economy tools to let HR professionals and team leaders become internal wellness content creators without expertise.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MindFlow Studio</h1>
      <p className="mt-4 text-lg">AI-powered mental wellness content creation platform that helps remote teams generate personalized mindfulness sessions, stress-relief workshops, and team bonding activities. Combines mental health focus with creator economy tools to let HR professionals and team leaders become internal wellness content creators without expertise.</p>
    </main>
  )
}
