import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Climate Pitch',
  description: 'AI-powered platform that generates personalized sustainability reports and carbon reduction roadmaps for small businesses, packaged as professional presentations for client meetings and investor pitches. Combines climate tech insights with creator economy tools to help businesses showcase their environmental impact and attract eco-conscious customers.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Climate Pitch</h1>
      <p className="mt-4 text-lg">AI-powered platform that generates personalized sustainability reports and carbon reduction roadmaps for small businesses, packaged as professional presentations for client meetings and investor pitches. Combines climate tech insights with creator economy tools to help businesses showcase their environmental impact and attract eco-conscious customers.</p>
    </main>
  )
}
