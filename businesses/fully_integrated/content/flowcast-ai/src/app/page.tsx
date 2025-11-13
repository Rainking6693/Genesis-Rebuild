import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FlowCast AI',
  description: 'AI-powered podcast generation platform that transforms small business expertise into professional podcast series, complete with automated transcription, show notes, and multi-platform distribution. Enables service-based businesses to scale their thought leadership and attract premium clients through consistent, high-quality audio content.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">FlowCast AI</h1>
      <p className="mt-4 text-lg">AI-powered podcast generation platform that transforms small business expertise into professional podcast series, complete with automated transcription, show notes, and multi-platform distribution. Enables service-based businesses to scale their thought leadership and attract premium clients through consistent, high-quality audio content.</p>
    </main>
  )
}
