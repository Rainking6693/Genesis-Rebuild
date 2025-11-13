import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoTrack Pro',
  description: 'AI-powered carbon footprint tracking and sustainability reporting platform that automatically calculates small businesses' environmental impact from their existing tools (accounting, shipping, utilities) and generates compliance-ready ESG reports. Turns complex climate regulations into automated workflows while helping businesses discover cost-saving green alternatives through our marketplace integration.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoTrack Pro</h1>
      <p className="mt-4 text-lg">AI-powered carbon footprint tracking and sustainability reporting platform that automatically calculates small businesses' environmental impact from their existing tools (accounting, shipping, utilities) and generates compliance-ready ESG reports. Turns complex climate regulations into automated workflows while helping businesses discover cost-saving green alternatives through our marketplace integration.</p>
    </main>
  )
}
