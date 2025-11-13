import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CarbonTrail AI',
  description: 'AI-powered carbon footprint tracker that automatically calculates and offsets business expenses in real-time by integrating with accounting software and expense platforms. Transforms every business purchase into an opportunity for climate action while providing detailed sustainability reporting for ESG compliance.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CarbonTrail AI</h1>
      <p className="mt-4 text-lg">AI-powered carbon footprint tracker that automatically calculates and offsets business expenses in real-time by integrating with accounting software and expense platforms. Transforms every business purchase into an opportunity for climate action while providing detailed sustainability reporting for ESG compliance.</p>
    </main>
  )
}
