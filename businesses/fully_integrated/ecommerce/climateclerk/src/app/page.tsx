import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ClimateClerk',
  description: 'AI-powered carbon accounting and sustainability compliance platform that automatically tracks, calculates, and reports carbon emissions for small businesses through receipt scanning and API integrations. Transforms complex climate reporting into a simple monthly subscription with automated ESG reports that help businesses win more contracts and meet regulatory requirements.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ClimateClerk</h1>
      <p className="mt-4 text-lg">AI-powered carbon accounting and sustainability compliance platform that automatically tracks, calculates, and reports carbon emissions for small businesses through receipt scanning and API integrations. Transforms complex climate reporting into a simple monthly subscription with automated ESG reports that help businesses win more contracts and meet regulatory requirements.</p>
    </main>
  )
}
