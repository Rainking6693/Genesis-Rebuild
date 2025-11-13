import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Burnout Buddy',
  description: 'AI-powered micro-coaching platform that delivers personalized burnout prevention content and wellness nudges directly integrated into remote workers' daily workflows through Slack/Teams. Combines mental health insights with productivity analytics to create custom intervention strategies before burnout occurs.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Burnout Buddy</h1>
      <p className="mt-4 text-lg">AI-powered micro-coaching platform that delivers personalized burnout prevention content and wellness nudges directly integrated into remote workers' daily workflows through Slack/Teams. Combines mental health insights with productivity analytics to create custom intervention strategies before burnout occurs.</p>
    </main>
  )
}
