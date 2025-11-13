import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CreatorVault',
  description: 'AI-powered subscription box curation platform that helps content creators monetize their expertise by automatically generating and managing niche subscription boxes for their audiences. Creators input their knowledge areas and audience preferences, while AI handles product sourcing, box themes, supplier negotiations, and logistics coordination.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CreatorVault</h1>
      <p className="mt-4 text-lg">AI-powered subscription box curation platform that helps content creators monetize their expertise by automatically generating and managing niche subscription boxes for their audiences. Creators input their knowledge areas and audience preferences, while AI handles product sourcing, box themes, supplier negotiations, and logistics coordination.</p>
    </main>
  )
}
