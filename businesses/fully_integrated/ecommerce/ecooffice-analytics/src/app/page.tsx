import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoOffice Analytics',
  description: 'AI-powered platform that helps remote teams track, reduce, and offset their distributed carbon footprint while boosting employee engagement through gamified sustainability challenges. Combines real-time environmental impact tracking with team wellness features and automated carbon offset purchasing.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoOffice Analytics</h1>
      <p className="mt-4 text-lg">AI-powered platform that helps remote teams track, reduce, and offset their distributed carbon footprint while boosting employee engagement through gamified sustainability challenges. Combines real-time environmental impact tracking with team wellness features and automated carbon offset purchasing.</p>
    </main>
  )
}
