import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'RetentionLab',
  description: 'AI-powered customer retention intelligence platform that analyzes e-commerce customer behavior to automatically generate personalized re-engagement content campaigns. Combines Web3 loyalty mechanics with health/wellness-style habit formation to turn one-time buyers into subscription customers.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">RetentionLab</h1>
      <p className="mt-4 text-lg">AI-powered customer retention intelligence platform that analyzes e-commerce customer behavior to automatically generate personalized re-engagement content campaigns. Combines Web3 loyalty mechanics with health/wellness-style habit formation to turn one-time buyers into subscription customers.</p>
    </main>
  )
}
