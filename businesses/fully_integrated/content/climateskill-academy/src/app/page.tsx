import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ClimateSkill Academy',
  description: 'AI-powered microlearning platform that delivers bite-sized, role-specific climate action training for employees, helping companies build sustainability expertise while meeting ESG compliance requirements. Each 5-minute daily lesson is personalized by job function and includes practical implementation steps with progress tracking.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">ClimateSkill Academy</h1>
      <p className="mt-4 text-lg">AI-powered microlearning platform that delivers bite-sized, role-specific climate action training for employees, helping companies build sustainability expertise while meeting ESG compliance requirements. Each 5-minute daily lesson is personalized by job function and includes practical implementation steps with progress tracking.</p>
    </main>
  )
}
