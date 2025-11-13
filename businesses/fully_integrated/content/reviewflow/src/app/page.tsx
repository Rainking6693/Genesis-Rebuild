import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ReviewFlow',
  description: 'AI-powered micro-SaaS that automatically generates personalized review request campaigns and tracks customer sentiment across all platforms for small e-commerce businesses. Combines automated email/SMS sequences with AI-driven sentiment analysis to boost positive reviews while flagging potential issues before they become public complaints.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ReviewFlow</h1>
      <p className="mt-4 text-lg">AI-powered micro-SaaS that automatically generates personalized review request campaigns and tracks customer sentiment across all platforms for small e-commerce businesses. Combines automated email/SMS sequences with AI-driven sentiment analysis to boost positive reviews while flagging potential issues before they become public complaints.</p>
    </main>
  )
}
