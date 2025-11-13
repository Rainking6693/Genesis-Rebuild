import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SkillSwap Hub',
  description: 'AI-powered platform that connects remote teams for internal skill-sharing sessions, turning employee expertise into structured micro-learning experiences. Combines community building with educational technology to reduce training costs while boosting employee engagement and retention.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">SkillSwap Hub</h1>
      <p className="mt-4 text-lg">AI-powered platform that connects remote teams for internal skill-sharing sessions, turning employee expertise into structured micro-learning experiences. Combines community building with educational technology to reduce training costs while boosting employee engagement and retention.</p>
    </main>
  )
}
