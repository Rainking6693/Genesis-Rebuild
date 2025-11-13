import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FinanceFlow Studio',
  description: 'AI-powered platform that automatically generates personalized financial education content and interactive calculators for small businesses to embed on their websites, boosting customer engagement and trust. Combines personal finance education with white-label SaaS tools that help businesses become trusted financial advisors to their customers.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">FinanceFlow Studio</h1>
      <p className="mt-4 text-lg">AI-powered platform that automatically generates personalized financial education content and interactive calculators for small businesses to embed on their websites, boosting customer engagement and trust. Combines personal finance education with white-label SaaS tools that help businesses become trusted financial advisors to their customers.</p>
    </main>
  )
}
