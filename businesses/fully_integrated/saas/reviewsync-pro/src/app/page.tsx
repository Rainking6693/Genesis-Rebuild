import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ReviewSync Pro',
  description: 'AI-powered review management platform that automatically responds to customer reviews across all platforms while maintaining brand voice and escalating negative reviews to human managers. It combines automation with community-driven templates and mental health support for overwhelmed business owners dealing with review anxiety.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ReviewSync Pro</h1>
      <p className="mt-4 text-lg">AI-powered review management platform that automatically responds to customer reviews across all platforms while maintaining brand voice and escalating negative reviews to human managers. It combines automation with community-driven templates and mental health support for overwhelmed business owners dealing with review anxiety.</p>
    </main>
  )
}
