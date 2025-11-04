import { NextResponse } from 'next/server'

const API_BASE = process.env.NEXT_PUBLIC_GENESIS_DASHBOARD_API || 'http://localhost:8080'
const ANALYTICS_ENDPOINT = '/api/memory/analytics'

export async function GET() {
  const url = `${API_BASE}${ANALYTICS_ENDPOINT}`
  const headers: HeadersInit = { 'Accept': 'application/json' }
  const token = process.env.MEMORY_ANALYTICS_API_TOKEN || process.env.NEXT_DASHBOARD_MEMORY_TOKEN
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, {
      headers,
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json({ error: `Upstream analytics request failed (${response.status})` }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error?.message ?? 'Failed to load memory analytics' }, { status: 500 })
  }
}
