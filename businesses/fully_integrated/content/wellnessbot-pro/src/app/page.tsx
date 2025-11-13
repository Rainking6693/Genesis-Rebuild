import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WellnessBot Pro',
  description: 'AI-powered wellness content automation platform that generates personalized health newsletters, social media posts, and client check-ins for wellness professionals and small health businesses. Combines health expertise with creator economy tools to help practitioners scale their content marketing while maintaining authenticity and compliance.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">WellnessBot Pro</h1>
      <p className="mt-4 text-lg">AI-powered wellness content automation platform that generates personalized health newsletters, social media posts, and client check-ins for wellness professionals and small health businesses. Combines health expertise with creator economy tools to help practitioners scale their content marketing while maintaining authenticity and compliance.</p>
    </main>
  )
}
