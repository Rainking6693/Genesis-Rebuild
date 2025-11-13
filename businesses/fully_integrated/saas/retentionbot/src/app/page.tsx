import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RetentionBot',
  description: 'AI-powered customer retention automation that predicts churn risk and deploys personalized win-back campaigns across email, SMS, and in-app notifications. Combines behavioral analytics with automated intervention workflows to reduce customer churn by 40-60% for subscription businesses.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">RetentionBot</h1>
      <p className="mt-4 text-lg">AI-powered customer retention automation that predicts churn risk and deploys personalized win-back campaigns across email, SMS, and in-app notifications. Combines behavioral analytics with automated intervention workflows to reduce customer churn by 40-60% for subscription businesses.</p>
    </main>
  )
}
