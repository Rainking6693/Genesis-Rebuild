import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WellnessFlow',
  description: 'AI-powered employee wellness automation platform that creates personalized micro-interventions and tracks team mental health metrics in real-time. Combines workplace wellness with creator economy by connecting companies to certified wellness coaches for scalable, data-driven employee support.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">WellnessFlow</h1>
      <p className="mt-4 text-lg">AI-powered employee wellness automation platform that creates personalized micro-interventions and tracks team mental health metrics in real-time. Combines workplace wellness with creator economy by connecting companies to certified wellness coaches for scalable, data-driven employee support.</p>
    </main>
  )
}
