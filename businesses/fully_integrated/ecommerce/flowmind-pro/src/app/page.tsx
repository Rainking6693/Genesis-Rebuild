import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FlowMind Pro',
  description: 'AI-powered mental wellness automation platform that creates personalized productivity rituals and stress management workflows for remote teams. Combines subscription wellness content with automated team mental health insights to boost performance while preventing burnout.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">FlowMind Pro</h1>
      <p className="mt-4 text-lg">AI-powered mental wellness automation platform that creates personalized productivity rituals and stress management workflows for remote teams. Combines subscription wellness content with automated team mental health insights to boost performance while preventing burnout.</p>
    </main>
  )
}
