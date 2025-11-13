import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ClimateROI Pro',
  description: 'AI-powered platform that generates personalized sustainability compliance reports and carbon offset investment recommendations for small businesses. Combines climate tech with financial analysis to help SMBs turn environmental compliance into profit centers through tax incentives, grants, and cost savings identification.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ClimateROI Pro</h1>
      <p className="mt-4 text-lg">AI-powered platform that generates personalized sustainability compliance reports and carbon offset investment recommendations for small businesses. Combines climate tech with financial analysis to help SMBs turn environmental compliance into profit centers through tax incentives, grants, and cost savings identification.</p>
    </main>
  )
}
