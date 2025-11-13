import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ClimateHire',
  description: 'AI-powered recruitment platform that matches climate-conscious professionals with sustainability-focused roles at companies with verified ESG credentials. We solve the disconnect between talented professionals wanting meaningful climate work and companies struggling to attract purpose-driven talent in the green economy.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ClimateHire</h1>
      <p className="mt-4 text-lg">AI-powered recruitment platform that matches climate-conscious professionals with sustainability-focused roles at companies with verified ESG credentials. We solve the disconnect between talented professionals wanting meaningful climate work and companies struggling to attract purpose-driven talent in the green economy.</p>
    </main>
  )
}
