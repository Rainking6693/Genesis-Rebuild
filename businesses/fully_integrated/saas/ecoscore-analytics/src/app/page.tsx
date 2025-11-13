import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoScore Analytics',
  description: 'AI-powered sustainability scoring platform that automatically tracks and scores small businesses' environmental impact across operations, then generates automated improvement recommendations and compliance reports. Combines real-time data monitoring with community-driven sustainability challenges to gamify eco-friendly business practices.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoScore Analytics</h1>
      <p className="mt-4 text-lg">AI-powered sustainability scoring platform that automatically tracks and scores small businesses' environmental impact across operations, then generates automated improvement recommendations and compliance reports. Combines real-time data monitoring with community-driven sustainability challenges to gamify eco-friendly business practices.</p>
    </main>
  )
}
