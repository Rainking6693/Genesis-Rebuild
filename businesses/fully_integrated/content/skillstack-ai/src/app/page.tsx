import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SkillStack AI',
  description: 'An AI-powered microlearning platform that automatically creates personalized skill development paths for remote teams by analyzing their project failures and knowledge gaps. It transforms workplace mistakes into structured learning opportunities with bite-sized lessons, peer mentoring, and team challenges.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">SkillStack AI</h1>
      <p className="mt-4 text-lg">An AI-powered microlearning platform that automatically creates personalized skill development paths for remote teams by analyzing their project failures and knowledge gaps. It transforms workplace mistakes into structured learning opportunities with bite-sized lessons, peer mentoring, and team challenges.</p>
    </main>
  )
}
