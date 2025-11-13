import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'StoryScale AI',
  description: 'AI-powered content transformation platform that converts single pieces of content into 20+ formats across different channels, specifically designed for small businesses without dedicated marketing teams. Combines creator economy tools with no-code automation to help businesses scale their content reach without hiring agencies.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">StoryScale AI</h1>
      <p className="mt-4 text-lg">AI-powered content transformation platform that converts single pieces of content into 20+ formats across different channels, specifically designed for small businesses without dedicated marketing teams. Combines creator economy tools with no-code automation to help businesses scale their content reach without hiring agencies.</p>
    </main>
  )
}
