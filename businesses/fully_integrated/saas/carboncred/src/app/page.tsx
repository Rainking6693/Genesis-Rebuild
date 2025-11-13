import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CarbonCred',
  description: 'AI-powered platform that automatically tracks e-commerce businesses' carbon footprint and converts it into verified carbon credits they can sell or use for marketing. Small online businesses get instant sustainability insights plus a new revenue stream by monetizing their green initiatives through automated carbon credit generation.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CarbonCred</h1>
      <p className="mt-4 text-lg">AI-powered platform that automatically tracks e-commerce businesses' carbon footprint and converts it into verified carbon credits they can sell or use for marketing. Small online businesses get instant sustainability insights plus a new revenue stream by monetizing their green initiatives through automated carbon credit generation.</p>
    </main>
  )
}
