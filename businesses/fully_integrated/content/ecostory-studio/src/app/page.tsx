import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoStory Studio',
  description: 'AI-powered platform that transforms small businesses' sustainability efforts into compelling, personalized content campaigns across multiple formats. Combines sustainability tracking with automated storytelling to help eco-conscious brands build authentic narratives that drive customer engagement and sales.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoStory Studio</h1>
      <p className="mt-4 text-lg">AI-powered platform that transforms small businesses' sustainability efforts into compelling, personalized content campaigns across multiple formats. Combines sustainability tracking with automated storytelling to help eco-conscious brands build authentic narratives that drive customer engagement and sales.</p>
    </main>
  )
}
