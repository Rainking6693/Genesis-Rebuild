import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PitchStack',
  description: 'AI-powered platform that automatically generates personalized sales pitch decks and follow-up sequences by analyzing prospect data from LinkedIn, company websites, and CRM integrations. Transforms generic sales outreach into hyper-personalized presentations that convert 3x better than traditional approaches.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">PitchStack</h1>
      <p className="mt-4 text-lg">AI-powered platform that automatically generates personalized sales pitch decks and follow-up sequences by analyzing prospect data from LinkedIn, company websites, and CRM integrations. Transforms generic sales outreach into hyper-personalized presentations that convert 3x better than traditional approaches.</p>
    </main>
  )
}
