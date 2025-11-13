import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ClimateStory',
  description: 'AI-powered sustainability storytelling platform that transforms small businesses' climate actions into compelling marketing content and compliance reports. Combines climate tech insights with creator economy tools to help SMBs showcase their environmental impact through automated content generation and distribution.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ClimateStory</h1>
      <p className="mt-4 text-lg">AI-powered sustainability storytelling platform that transforms small businesses' climate actions into compelling marketing content and compliance reports. Combines climate tech insights with creator economy tools to help SMBs showcase their environmental impact through automated content generation and distribution.</p>
    </main>
  )
}
