import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SkillStack AI',
  description: 'AI-powered platform that automatically generates personalized learning paths and micro-certifications for small business employees based on their role, company goals, and skill gaps. Combines educational technology with subscription-based learning while providing businesses with automated workforce development analytics.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">SkillStack AI</h1>
      <p className="mt-4 text-lg">AI-powered platform that automatically generates personalized learning paths and micro-certifications for small business employees based on their role, company goals, and skill gaps. Combines educational technology with subscription-based learning while providing businesses with automated workforce development analytics.</p>
    </main>
  )
}
