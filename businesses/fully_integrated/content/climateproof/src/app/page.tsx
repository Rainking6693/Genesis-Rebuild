import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ClimateProof',
  description: 'AI-powered platform that generates personalized climate risk assessments and actionable adaptation strategies for small businesses. Combines real-time climate data with industry-specific insights to help businesses proactively protect their operations and unlock green financing opportunities.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ClimateProof</h1>
      <p className="mt-4 text-lg">AI-powered platform that generates personalized climate risk assessments and actionable adaptation strategies for small businesses. Combines real-time climate data with industry-specific insights to help businesses proactively protect their operations and unlock green financing opportunities.</p>
    </main>
  )
}
