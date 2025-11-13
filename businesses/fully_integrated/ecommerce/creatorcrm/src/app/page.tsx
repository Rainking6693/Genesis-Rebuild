import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CreatorCRM',
  description: 'AI-powered customer relationship management platform specifically designed for content creators to monetize their audience through personalized product recommendations and automated sales funnels. Combines creator economy insights with e-commerce automation to turn followers into paying customers.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CreatorCRM</h1>
      <p className="mt-4 text-lg">AI-powered customer relationship management platform specifically designed for content creators to monetize their audience through personalized product recommendations and automated sales funnels. Combines creator economy insights with e-commerce automation to turn followers into paying customers.</p>
    </main>
  )
}
