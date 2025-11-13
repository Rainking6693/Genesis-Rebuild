import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoSell Academy',
  description: 'AI-powered learning platform that teaches e-commerce businesses how to implement profitable sustainability practices through micro-courses, automated compliance tracking, and community-driven case studies. Combines educational content with actionable automation tools that immediately reduce costs while improving environmental impact.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoSell Academy</h1>
      <p className="mt-4 text-lg">AI-powered learning platform that teaches e-commerce businesses how to implement profitable sustainability practices through micro-courses, automated compliance tracking, and community-driven case studies. Combines educational content with actionable automation tools that immediately reduce costs while improving environmental impact.</p>
    </main>
  )
}
