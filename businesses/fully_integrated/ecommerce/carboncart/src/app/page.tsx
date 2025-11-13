import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CarbonCart',
  description: 'AI-powered carbon footprint calculator for e-commerce purchases that automatically suggests lower-impact alternatives and facilitates instant carbon offset purchases. Transforms climate anxiety into actionable purchasing decisions while helping businesses showcase their sustainability efforts.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">CarbonCart</h1>
      <p className="mt-4 text-lg">AI-powered carbon footprint calculator for e-commerce purchases that automatically suggests lower-impact alternatives and facilitates instant carbon offset purchases. Transforms climate anxiety into actionable purchasing decisions while helping businesses showcase their sustainability efforts.</p>
    </main>
  )
}
