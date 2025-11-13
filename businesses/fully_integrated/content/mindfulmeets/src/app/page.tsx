import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MindfulMeets',
  description: 'AI-powered platform that generates personalized mental wellness content and micro-interventions specifically designed for remote teams during virtual meetings. Combines real-time meeting sentiment analysis with evidence-based wellness techniques to boost team mental health and productivity.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MindfulMeets</h1>
      <p className="mt-4 text-lg">AI-powered platform that generates personalized mental wellness content and micro-interventions specifically designed for remote teams during virtual meetings. Combines real-time meeting sentiment analysis with evidence-based wellness techniques to boost team mental health and productivity.</p>
    </main>
  )
}
