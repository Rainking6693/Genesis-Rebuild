import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ClimateCommit',
  description: 'An AI-powered community platform that helps small businesses automatically track, offset, and showcase their carbon footprint while building customer loyalty through transparent sustainability actions. Businesses get real-time ESG scoring, automated carbon offset purchasing, and community-driven sustainability challenges that customers can participate in.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ClimateCommit</h1>
      <p className="mt-4 text-lg">An AI-powered community platform that helps small businesses automatically track, offset, and showcase their carbon footprint while building customer loyalty through transparent sustainability actions. Businesses get real-time ESG scoring, automated carbon offset purchasing, and community-driven sustainability challenges that customers can participate in.</p>
    </main>
  )
}
