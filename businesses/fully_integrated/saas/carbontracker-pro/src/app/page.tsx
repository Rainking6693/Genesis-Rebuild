import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CarbonTracker Pro',
  description: 'AI-powered carbon footprint tracking and offset automation platform that helps small businesses automatically calculate, report, and reduce their environmental impact while earning sustainability certifications. Transforms complex climate compliance into simple, automated workflows that boost brand reputation and meet B2B customer sustainability requirements.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CarbonTracker Pro</h1>
      <p className="mt-4 text-lg">AI-powered carbon footprint tracking and offset automation platform that helps small businesses automatically calculate, report, and reduce their environmental impact while earning sustainability certifications. Transforms complex climate compliance into simple, automated workflows that boost brand reputation and meet B2B customer sustainability requirements.</p>
    </main>
  )
}
