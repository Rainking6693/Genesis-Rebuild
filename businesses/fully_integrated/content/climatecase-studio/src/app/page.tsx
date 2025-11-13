import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ClimateCase Studio',
  description: 'AI-powered platform that automatically generates compelling sustainability case studies and ROI reports for small businesses implementing green initiatives. Transforms basic eco-friendly actions into professional marketing content and compliance documentation that drives customer acquisition and meets ESG requirements.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ClimateCase Studio</h1>
      <p className="mt-4 text-lg">AI-powered platform that automatically generates compelling sustainability case studies and ROI reports for small businesses implementing green initiatives. Transforms basic eco-friendly actions into professional marketing content and compliance documentation that drives customer acquisition and meets ESG requirements.</p>
    </main>
  )
}
