import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WellnessFlow AI',
  description: 'AI-powered workplace wellness platform that automatically generates personalized mental health and productivity micro-interventions for employees based on their work patterns, stress levels, and team dynamics. Creates custom wellness product bundles and delivers them subscription-style to boost employee retention and reduce burnout costs for SMBs.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">WellnessFlow AI</h1>
      <p className="mt-4 text-lg">AI-powered workplace wellness platform that automatically generates personalized mental health and productivity micro-interventions for employees based on their work patterns, stress levels, and team dynamics. Creates custom wellness product bundles and delivers them subscription-style to boost employee retention and reduce burnout costs for SMBs.</p>
    </main>
  )
}
