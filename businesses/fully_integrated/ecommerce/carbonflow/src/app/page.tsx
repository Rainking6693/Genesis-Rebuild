import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CarbonFlow',
  description: 'AI-powered subscription platform that automatically calculates small businesses' carbon footprint and delivers personalized monthly carbon offset packages with verified impact tracking. Combines climate tech with subscription commerce to make carbon neutrality effortless and affordable for SMBs.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CarbonFlow</h1>
      <p className="mt-4 text-lg">AI-powered subscription platform that automatically calculates small businesses' carbon footprint and delivers personalized monthly carbon offset packages with verified impact tracking. Combines climate tech with subscription commerce to make carbon neutrality effortless and affordable for SMBs.</p>
    </main>
  )
}
