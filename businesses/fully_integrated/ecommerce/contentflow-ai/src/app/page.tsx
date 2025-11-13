import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ContentFlow AI',
  description: 'AI-powered content repurposing platform that automatically transforms long-form content into 20+ formats optimized for different social platforms and audiences. Small businesses upload one piece of content and get a month's worth of social media posts, email sequences, and marketing copy instantly.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ContentFlow AI</h1>
      <p className="mt-4 text-lg">AI-powered content repurposing platform that automatically transforms long-form content into 20+ formats optimized for different social platforms and audiences. Small businesses upload one piece of content and get a month's worth of social media posts, email sequences, and marketing copy instantly.</p>
    </main>
  )
}
