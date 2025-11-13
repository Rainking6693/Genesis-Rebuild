import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CarbonShift',
  description: 'AI-powered platform that automatically calculates carbon footprints for e-commerce purchases and instantly suggests lower-carbon alternatives from verified sustainable brands. Transforms climate guilt into profitable action by gamifying sustainable shopping with rewards and community challenges.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CarbonShift</h1>
      <p className="mt-4 text-lg">AI-powered platform that automatically calculates carbon footprints for e-commerce purchases and instantly suggests lower-carbon alternatives from verified sustainable brands. Transforms climate guilt into profitable action by gamifying sustainable shopping with rewards and community challenges.</p>
    </main>
  )
}
