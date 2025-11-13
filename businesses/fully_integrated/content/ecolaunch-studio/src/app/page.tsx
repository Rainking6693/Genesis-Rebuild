import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoLaunch Studio',
  description: 'AI-powered platform that generates complete sustainable product launch campaigns for eco-conscious brands. Creates data-driven content strategies, sustainability impact stories, and community-building frameworks that convert environmental values into sales.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoLaunch Studio</h1>
      <p className="mt-4 text-lg">AI-powered platform that generates complete sustainable product launch campaigns for eco-conscious brands. Creates data-driven content strategies, sustainability impact stories, and community-building frameworks that convert environmental values into sales.</p>
    </main>
  )
}
