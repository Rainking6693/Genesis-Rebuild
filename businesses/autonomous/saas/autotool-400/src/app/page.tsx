import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AutoTool 400',
  description: 'SaaS automation tool for small businesses. Saves 10+ hours/week on repetitive tasks.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">AutoTool 400</h1>
      <p className="mt-4 text-lg">SaaS automation tool for small businesses. Saves 10+ hours/week on repetitive tasks.</p>
    </main>
  )
}
