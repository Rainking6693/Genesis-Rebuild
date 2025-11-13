import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AutoFlow Studio',
  description: 'A no-code automation platform that helps small businesses create intelligent customer journey workflows by connecting their existing tools (CRM, email, social media) with AI-powered triggers and actions. Think Zapier meets customer success automation, but specifically designed for businesses without technical teams.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">AutoFlow Studio</h1>
      <p className="mt-4 text-lg">A no-code automation platform that helps small businesses create intelligent customer journey workflows by connecting their existing tools (CRM, email, social media) with AI-powered triggers and actions. Think Zapier meets customer success automation, but specifically designed for businesses without technical teams.</p>
    </main>
  )
}
