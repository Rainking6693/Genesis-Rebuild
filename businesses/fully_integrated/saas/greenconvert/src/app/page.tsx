import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'GreenConvert',
  description: 'AI-powered sustainability optimizer that automatically calculates and displays the carbon footprint of every product on e-commerce sites, then converts eco-conscious shoppers with personalized green alternatives and carbon offset options. Transforms climate anxiety into purchase confidence while boosting conversion rates for sustainable brands.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">GreenConvert</h1>
      <p className="mt-4 text-lg">AI-powered sustainability optimizer that automatically calculates and displays the carbon footprint of every product on e-commerce sites, then converts eco-conscious shoppers with personalized green alternatives and carbon offset options. Transforms climate anxiety into purchase confidence while boosting conversion rates for sustainable brands.</p>
    </main>
  )
}
