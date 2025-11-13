import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ClimateCredit Hub',
  description: 'AI-powered marketplace that helps small businesses automatically purchase verified carbon credits through their existing subscriptions and services, turning every business transaction into climate action. Businesses earn sustainability badges and reporting while supporting vetted climate projects, with zero manual effort required.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ClimateCredit Hub</h1>
      <p className="mt-4 text-lg">AI-powered marketplace that helps small businesses automatically purchase verified carbon credits through their existing subscriptions and services, turning every business transaction into climate action. Businesses earn sustainability badges and reporting while supporting vetted climate projects, with zero manual effort required.</p>
    </main>
  )
}
