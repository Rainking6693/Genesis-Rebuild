import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'StoryBridge AI',
  description: 'AI-powered micro-SaaS that transforms complex B2B case studies and technical content into engaging, multi-format stories optimized for different buyer personas. Creates personalized content variants (executive summaries, technical deep-dives, social posts) from a single input, helping B2B companies scale their content marketing without hiring writers.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">StoryBridge AI</h1>
      <p className="mt-4 text-lg">AI-powered micro-SaaS that transforms complex B2B case studies and technical content into engaging, multi-format stories optimized for different buyer personas. Creates personalized content variants (executive summaries, technical deep-dives, social posts) from a single input, helping B2B companies scale their content marketing without hiring writers.</p>
    </main>
  )
}
