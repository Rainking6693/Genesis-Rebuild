import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MoodSync Commerce',
  description: 'AI-powered mental wellness platform that creates personalized product recommendations and curated shopping experiences based on users' emotional states and stress levels. Combines mental health tracking with affiliate commerce to help users discover products that genuinely improve their wellbeing while generating revenue through strategic partnerships.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MoodSync Commerce</h1>
      <p className="mt-4 text-lg">AI-powered mental wellness platform that creates personalized product recommendations and curated shopping experiences based on users' emotional states and stress levels. Combines mental health tracking with affiliate commerce to help users discover products that genuinely improve their wellbeing while generating revenue through strategic partnerships.</p>
    </main>
  )
}
