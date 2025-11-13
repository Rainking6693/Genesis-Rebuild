import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SkillSync Pro',
  description: 'AI-powered micro-learning platform that creates personalized 5-minute daily skill courses for remote teams based on their actual work challenges and knowledge gaps. Combines real workplace data with bite-sized expert content to deliver just-in-time learning that immediately impacts productivity.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">SkillSync Pro</h1>
      <p className="mt-4 text-lg">AI-powered micro-learning platform that creates personalized 5-minute daily skill courses for remote teams based on their actual work challenges and knowledge gaps. Combines real workplace data with bite-sized expert content to deliver just-in-time learning that immediately impacts productivity.</p>
    </main>
  )
}
