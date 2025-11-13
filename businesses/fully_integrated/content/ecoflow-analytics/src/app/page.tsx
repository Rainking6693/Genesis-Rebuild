import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoFlow Analytics',
  description: 'AI-powered sustainability analytics platform that automatically tracks, scores, and optimizes small businesses' environmental impact while generating marketing content around their green initiatives. Transforms compliance burden into competitive advantage by creating authentic sustainability stories that boost customer loyalty and attract eco-conscious consumers.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoFlow Analytics</h1>
      <p className="mt-4 text-lg">AI-powered sustainability analytics platform that automatically tracks, scores, and optimizes small businesses' environmental impact while generating marketing content around their green initiatives. Transforms compliance burden into competitive advantage by creating authentic sustainability stories that boost customer loyalty and attract eco-conscious consumers.</p>
    </main>
  )
}
