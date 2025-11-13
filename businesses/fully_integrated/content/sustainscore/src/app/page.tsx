import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SustainScore',
  description: 'AI-powered sustainability assessment platform that generates detailed environmental impact reports and improvement roadmaps for small businesses within minutes. We transform complex ESG compliance into actionable, automated insights that help businesses reduce costs while meeting growing sustainability demands from customers and partners.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">SustainScore</h1>
      <p className="mt-4 text-lg">AI-powered sustainability assessment platform that generates detailed environmental impact reports and improvement roadmaps for small businesses within minutes. We transform complex ESG compliance into actionable, automated insights that help businesses reduce costs while meeting growing sustainability demands from customers and partners.</p>
    </main>
  )
}
