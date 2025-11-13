import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ClimateComply',
  description: 'AI-powered platform that generates personalized sustainability compliance reports and carbon footprint reduction strategies for small businesses. Combines regulatory tracking with actionable micro-SaaS tools to help SMBs meet ESG requirements while reducing operational costs.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ClimateComply</h1>
      <p className="mt-4 text-lg">AI-powered platform that generates personalized sustainability compliance reports and carbon footprint reduction strategies for small businesses. Combines regulatory tracking with actionable micro-SaaS tools to help SMBs meet ESG requirements while reducing operational costs.</p>
    </main>
  )
}
