import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MoodMetrics',
  description: 'AI-powered emotional intelligence analytics platform that helps remote teams track, understand, and improve workplace mental health through automated sentiment analysis of team communications. Creates personalized wellness content and intervention recommendations based on real-time mood patterns detected in Slack, email, and video calls.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MoodMetrics</h1>
      <p className="mt-4 text-lg">AI-powered emotional intelligence analytics platform that helps remote teams track, understand, and improve workplace mental health through automated sentiment analysis of team communications. Creates personalized wellness content and intervention recommendations based on real-time mood patterns detected in Slack, email, and video calls.</p>
    </main>
  )
}
