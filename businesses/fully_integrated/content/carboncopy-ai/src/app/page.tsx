import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CarbonCopy AI',
  description: 'AI-powered platform that transforms small businesses into sustainable brands by automatically generating carbon-neutral messaging, eco-friendly product descriptions, and sustainability reports that boost conversions. Combines climate tech insights with AI content generation to help businesses tap into the $150B sustainable commerce market without hiring expensive sustainability consultants.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CarbonCopy AI</h1>
      <p className="mt-4 text-lg">AI-powered platform that transforms small businesses into sustainable brands by automatically generating carbon-neutral messaging, eco-friendly product descriptions, and sustainability reports that boost conversions. Combines climate tech insights with AI content generation to help businesses tap into the $150B sustainable commerce market without hiring expensive sustainability consultants.</p>
    </main>
  )
}
