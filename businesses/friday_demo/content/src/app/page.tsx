import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DevInsights Blog',
  description: 'Content platform for software development insights',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">{'}}{spec.name}{{'}</h1>
      <p className="mt-4 text-lg">{'}}{spec.description}{{'}</p>
    </main>
  )
}
