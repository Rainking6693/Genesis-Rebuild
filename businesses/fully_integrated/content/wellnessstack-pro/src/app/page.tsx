import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WellnessStack Pro',
  description: 'AI-powered wellness content automation platform that generates personalized employee wellness newsletters, mental health tips, and wellness challenges for small businesses. Combines personal finance stress management, mental health insights, and workplace wellness into bite-sized, actionable content that HR teams can deploy instantly.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">WellnessStack Pro</h1>
      <p className="mt-4 text-lg">AI-powered wellness content automation platform that generates personalized employee wellness newsletters, mental health tips, and wellness challenges for small businesses. Combines personal finance stress management, mental health insights, and workplace wellness into bite-sized, actionable content that HR teams can deploy instantly.</p>
    </main>
  )
}
