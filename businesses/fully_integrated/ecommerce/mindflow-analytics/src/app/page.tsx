import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MindFlow Analytics',
  description: 'An AI-powered mental wellness platform that analyzes team communication patterns (Slack, email, meetings) to predict burnout risk and automatically deliver personalized micro-interventions through existing workflows. It combines workplace mental health monitoring with productivity insights, helping small businesses prevent costly turnover while boosting team performance.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MindFlow Analytics</h1>
      <p className="mt-4 text-lg">An AI-powered mental wellness platform that analyzes team communication patterns (Slack, email, meetings) to predict burnout risk and automatically deliver personalized micro-interventions through existing workflows. It combines workplace mental health monitoring with productivity insights, helping small businesses prevent costly turnover while boosting team performance.</p>
    </main>
  )
}
