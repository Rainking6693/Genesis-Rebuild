import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EcoSpend Tracker',
  description: 'AI-powered personal finance app that automatically tracks your carbon footprint per purchase and helps you make climate-conscious spending decisions while improving your mental wellness through guilt-free budgeting. Users earn 'green credits' for sustainable purchases that unlock exclusive discounts at eco-friendly partner brands.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">EcoSpend Tracker</h1>
      <p className="mt-4 text-lg">AI-powered personal finance app that automatically tracks your carbon footprint per purchase and helps you make climate-conscious spending decisions while improving your mental wellness through guilt-free budgeting. Users earn 'green credits' for sustainable purchases that unlock exclusive discounts at eco-friendly partner brands.</p>
    </main>
  )
}
