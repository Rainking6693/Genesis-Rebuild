import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoMood Tracker',
  description: 'A mental wellness platform that connects daily mood patterns with environmental data, helping remote workers and climate-conscious professionals understand how air quality, weather, and sustainability actions impact their productivity and mental health. Users receive personalized content, challenges, and workspace optimization tips based on their unique environmental-mood correlations.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoMood Tracker</h1>
      <p className="mt-4 text-lg">A mental wellness platform that connects daily mood patterns with environmental data, helping remote workers and climate-conscious professionals understand how air quality, weather, and sustainability actions impact their productivity and mental health. Users receive personalized content, challenges, and workspace optimization tips based on their unique environmental-mood correlations.</p>
    </main>
  )
}
