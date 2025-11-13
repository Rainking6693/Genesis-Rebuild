import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MoodBoard',
  description: 'AI-powered employee wellness platform that automatically detects team burnout patterns through Slack/Teams integration and provides personalized mental health interventions. Combines anonymous mood tracking with automated manager alerts and employee resource recommendations to prevent turnover before it happens.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MoodBoard</h1>
      <p className="mt-4 text-lg">AI-powered employee wellness platform that automatically detects team burnout patterns through Slack/Teams integration and provides personalized mental health interventions. Combines anonymous mood tracking with automated manager alerts and employee resource recommendations to prevent turnover before it happens.</p>
    </main>
  )
}
