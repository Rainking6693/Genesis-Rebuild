import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SkillStack Pro',
  description: 'AI-powered micro-learning platform that automatically creates personalized skill development paths for remote teams based on their actual work patterns and performance gaps. Unlike generic training platforms, it integrates with existing work tools to identify skill gaps in real-time and delivers bite-sized lessons during natural workflow breaks.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">SkillStack Pro</h1>
      <p className="mt-4 text-lg">AI-powered micro-learning platform that automatically creates personalized skill development paths for remote teams based on their actual work patterns and performance gaps. Unlike generic training platforms, it integrates with existing work tools to identify skill gaps in real-time and delivers bite-sized lessons during natural workflow breaks.</p>
    </main>
  )
}
