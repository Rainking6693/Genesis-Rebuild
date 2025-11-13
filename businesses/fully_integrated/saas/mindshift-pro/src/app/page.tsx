import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MindShift Pro',
  description: 'AI-powered mental wellness platform that transforms workplace stress into productivity insights for small business teams. Combines anonymous mood tracking with automated team wellness recommendations and productivity optimization strategies.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">MindShift Pro</h1>
      <p className="mt-4 text-lg">AI-powered mental wellness platform that transforms workplace stress into productivity insights for small business teams. Combines anonymous mood tracking with automated team wellness recommendations and productivity optimization strategies.</p>
    </main>
  )
}
