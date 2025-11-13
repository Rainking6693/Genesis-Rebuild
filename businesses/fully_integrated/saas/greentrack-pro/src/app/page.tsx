import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GreenTrack Pro',
  description: 'AI-powered sustainability tracking platform that automatically calculates and optimizes small businesses' carbon footprint while generating compliance reports and cost-saving recommendations. Combines climate tech with automation to turn environmental responsibility into a profit center through tax incentives, supplier negotiations, and operational efficiencies.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">GreenTrack Pro</h1>
      <p className="mt-4 text-lg">AI-powered sustainability tracking platform that automatically calculates and optimizes small businesses' carbon footprint while generating compliance reports and cost-saving recommendations. Combines climate tech with automation to turn environmental responsibility into a profit center through tax incentives, supplier negotiations, and operational efficiencies.</p>
    </main>
  )
}
