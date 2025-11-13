import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Carbon Copilot',
  description: 'AI-powered sustainability content platform that auto-generates personalized carbon reduction action plans and compliance reports for small businesses. Combines real-time emissions tracking with automated content creation to help SMBs meet ESG requirements while reducing operational costs.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Carbon Copilot</h1>
      <p className="mt-4 text-lg">AI-powered sustainability content platform that auto-generates personalized carbon reduction action plans and compliance reports for small businesses. Combines real-time emissions tracking with automated content creation to help SMBs meet ESG requirements while reducing operational costs.</p>
    </main>
  )
}
