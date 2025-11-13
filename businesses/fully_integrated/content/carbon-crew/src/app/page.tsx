import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Carbon Crew',
  description: 'An AI-powered platform that generates personalized sustainability action plans and progress tracking for remote teams, turning climate action into engaging team challenges with real environmental impact measurement. Companies subscribe to boost employee engagement while achieving measurable ESG goals through gamified carbon reduction competitions.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Carbon Crew</h1>
      <p className="mt-4 text-lg">An AI-powered platform that generates personalized sustainability action plans and progress tracking for remote teams, turning climate action into engaging team challenges with real environmental impact measurement. Companies subscribe to boost employee engagement while achieving measurable ESG goals through gamified carbon reduction competitions.</p>
    </main>
  )
}
