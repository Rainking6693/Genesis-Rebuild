import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MindfulMetrics',
  description: 'An AI-powered workplace wellness platform that automatically tracks team stress patterns through Slack/Teams integration and delivers personalized mental health micro-interventions. Companies get real-time burnout prevention analytics while employees receive anonymous, bite-sized wellness content tailored to their communication patterns.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MindfulMetrics</h1>
      <p className="mt-4 text-lg">An AI-powered workplace wellness platform that automatically tracks team stress patterns through Slack/Teams integration and delivers personalized mental health micro-interventions. Companies get real-time burnout prevention analytics while employees receive anonymous, bite-sized wellness content tailored to their communication patterns.</p>
    </main>
  )
}
