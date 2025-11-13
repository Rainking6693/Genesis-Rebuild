import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'WellnessOps',
  description: 'AI-powered platform that creates personalized employee wellness content and automates health program delivery for small businesses. Combines workplace wellness trends with no-code automation to help companies boost productivity and reduce healthcare costs through data-driven wellness initiatives.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">WellnessOps</h1>
      <p className="mt-4 text-lg">AI-powered platform that creates personalized employee wellness content and automates health program delivery for small businesses. Combines workplace wellness trends with no-code automation to help companies boost productivity and reduce healthcare costs through data-driven wellness initiatives.</p>
    </main>
  )
}
