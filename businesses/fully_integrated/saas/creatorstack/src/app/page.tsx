import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CreatorStack',
  description: 'AI-powered community monetization platform that helps content creators automatically transform their audience interactions into premium, searchable knowledge bases. Creators can instantly monetize their expertise by turning Discord chats, YouTube comments, and live streams into subscription-based Q&A databases that fans pay to access.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CreatorStack</h1>
      <p className="mt-4 text-lg">AI-powered community monetization platform that helps content creators automatically transform their audience interactions into premium, searchable knowledge bases. Creators can instantly monetize their expertise by turning Discord chats, YouTube comments, and live streams into subscription-based Q&A databases that fans pay to access.</p>
    </main>
  )
}
