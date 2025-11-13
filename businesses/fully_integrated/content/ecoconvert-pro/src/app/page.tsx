import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoConvert Pro',
  description: 'AI-powered sustainability audit and conversion optimization platform that helps e-commerce businesses automatically identify eco-friendly product alternatives and create compelling green marketing content that increases conversions. Combines real-time sustainability scoring with automated content generation to turn environmental consciousness into profitable sales.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoConvert Pro</h1>
      <p className="mt-4 text-lg">AI-powered sustainability audit and conversion optimization platform that helps e-commerce businesses automatically identify eco-friendly product alternatives and create compelling green marketing content that increases conversions. Combines real-time sustainability scoring with automated content generation to turn environmental consciousness into profitable sales.</p>
    </main>
  )
}
