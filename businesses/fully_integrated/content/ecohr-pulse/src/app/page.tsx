import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoHR Pulse',
  description: 'AI-powered platform that helps remote teams build sustainable work habits while tracking their collective environmental impact through gamified challenges and expert-curated content. Combines mental wellness, climate action, and team building into one engaging SaaS solution for distributed workforces.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoHR Pulse</h1>
      <p className="mt-4 text-lg">AI-powered platform that helps remote teams build sustainable work habits while tracking their collective environmental impact through gamified challenges and expert-curated content. Combines mental wellness, climate action, and team building into one engaging SaaS solution for distributed workforces.</p>
    </main>
  )
}
