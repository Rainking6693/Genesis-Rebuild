import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RetentionBot AI',
  description: 'AI-powered subscription retention platform that automatically identifies at-risk customers and deploys personalized win-back campaigns across email, SMS, and in-app notifications. Uses machine learning to predict churn 30-90 days before it happens and automatically executes proven retention playbooks.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">RetentionBot AI</h1>
      <p className="mt-4 text-lg">AI-powered subscription retention platform that automatically identifies at-risk customers and deploys personalized win-back campaigns across email, SMS, and in-app notifications. Uses machine learning to predict churn 30-90 days before it happens and automatically executes proven retention playbooks.</p>
    </main>
  )
}
