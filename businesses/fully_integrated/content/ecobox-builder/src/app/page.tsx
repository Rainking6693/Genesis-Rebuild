import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoBox Builder',
  description: 'A no-code platform that enables sustainable product creators to launch subscription box services with AI-powered curation and community features. Small eco-businesses can build, customize, and manage their subscription commerce without technical skills while connecting with environmentally conscious consumers.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoBox Builder</h1>
      <p className="mt-4 text-lg">A no-code platform that enables sustainable product creators to launch subscription box services with AI-powered curation and community features. Small eco-businesses can build, customize, and manage their subscription commerce without technical skills while connecting with environmentally conscious consumers.</p>
    </main>
  )
}
