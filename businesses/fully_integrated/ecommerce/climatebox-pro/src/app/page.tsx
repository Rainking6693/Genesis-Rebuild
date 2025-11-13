import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ClimateBox Pro',
  description: 'AI-powered subscription service that delivers personalized sustainable product bundles to small businesses while providing carbon tracking analytics and team engagement features. Combines eco-friendly procurement with automated sustainability reporting to help companies meet ESG goals effortlessly.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ClimateBox Pro</h1>
      <p className="mt-4 text-lg">AI-powered subscription service that delivers personalized sustainable product bundles to small businesses while providing carbon tracking analytics and team engagement features. Combines eco-friendly procurement with automated sustainability reporting to help companies meet ESG goals effortlessly.</p>
    </main>
  )
}
