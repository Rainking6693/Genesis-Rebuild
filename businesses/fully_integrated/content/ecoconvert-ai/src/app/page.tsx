import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoConvert AI',
  description: 'AI-powered platform that automatically generates personalized sustainability action plans and ROI calculators for e-commerce businesses, turning climate compliance from a cost center into a profit driver. Creates viral sustainability scorecards that customers can share, driving organic growth while helping businesses reduce costs and attract eco-conscious buyers.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoConvert AI</h1>
      <p className="mt-4 text-lg">AI-powered platform that automatically generates personalized sustainability action plans and ROI calculators for e-commerce businesses, turning climate compliance from a cost center into a profit driver. Creates viral sustainability scorecards that customers can share, driving organic growth while helping businesses reduce costs and attract eco-conscious buyers.</p>
    </main>
  )
}
