import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CommunityLens AI',
  description: 'AI-powered community analytics platform that transforms Discord, Slack, and social media conversations into actionable business intelligence for product teams and marketers. Automatically identifies emerging trends, sentiment shifts, and feature requests from community chatter to inform product roadmaps and marketing strategies.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CommunityLens AI</h1>
      <p className="mt-4 text-lg">AI-powered community analytics platform that transforms Discord, Slack, and social media conversations into actionable business intelligence for product teams and marketers. Automatically identifies emerging trends, sentiment shifts, and feature requests from community chatter to inform product roadmaps and marketing strategies.</p>
    </main>
  )
}
