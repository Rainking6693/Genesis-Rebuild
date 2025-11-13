import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MoodCart AI',
  description: 'AI-powered personalized shopping platform that curates products based on users' emotional states and mental wellness goals, combining sustainable brands with mood-boosting purchase recommendations. Uses sentiment analysis of social media, calendar events, and user input to deliver perfectly timed product suggestions that enhance wellbeing.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MoodCart AI</h1>
      <p className="mt-4 text-lg">AI-powered personalized shopping platform that curates products based on users' emotional states and mental wellness goals, combining sustainable brands with mood-boosting purchase recommendations. Uses sentiment analysis of social media, calendar events, and user input to deliver perfectly timed product suggestions that enhance wellbeing.</p>
    </main>
  )
}
