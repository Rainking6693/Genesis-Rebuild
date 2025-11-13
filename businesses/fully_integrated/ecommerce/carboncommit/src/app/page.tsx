import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CarbonCommit',
  description: 'An AI-powered B2B SaaS platform that automatically calculates and offsets the carbon footprint of every business transaction, then generates compliance reports and customer-facing sustainability certificates. Businesses pay per transaction processed, creating a scalable model that grows with their success while helping them meet ESG goals effortlessly.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CarbonCommit</h1>
      <p className="mt-4 text-lg">An AI-powered B2B SaaS platform that automatically calculates and offsets the carbon footprint of every business transaction, then generates compliance reports and customer-facing sustainability certificates. Businesses pay per transaction processed, creating a scalable model that grows with their success while helping them meet ESG goals effortlessly.</p>
    </main>
  )
}
