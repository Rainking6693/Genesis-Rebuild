import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ReturnFlow AI',
  description: 'AI-powered subscription box analytics platform that predicts customer return behavior and generates personalized retention content campaigns. Combines predictive analytics with automated email/SMS sequences to reduce churn for subscription box businesses.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ReturnFlow AI</h1>
      <p className="mt-4 text-lg">AI-powered subscription box analytics platform that predicts customer return behavior and generates personalized retention content campaigns. Combines predictive analytics with automated email/SMS sequences to reduce churn for subscription box businesses.</p>
    </main>
  )
}
