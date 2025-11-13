import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SkillStack',
  description: 'AI-powered micro-learning platform that creates personalized certification tracks for small business teams, combining bite-sized courses with blockchain-verified credentials. Employers can instantly validate employee skills while workers build stackable, transferable certifications across multiple domains.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">SkillStack</h1>
      <p className="mt-4 text-lg">AI-powered micro-learning platform that creates personalized certification tracks for small business teams, combining bite-sized courses with blockchain-verified credentials. Employers can instantly validate employee skills while workers build stackable, transferable certifications across multiple domains.</p>
    </main>
  )
}
