const DEFAULT_API_BASE = process.env.NEXT_PUBLIC_GENESIS_DASHBOARD_API ?? '/dashboard-api'

export async function fetchDashboardJson<T = unknown>(path: string, signal?: AbortSignal): Promise<T> {
  const trimmed = path.startsWith('/') ? path : `/${path}`
  const url = `${DEFAULT_API_BASE}${trimmed}`
  const response = await fetch(url, { signal, cache: 'no-store' })

  if (!response.ok) {
    throw new Error(`Request to ${url} failed with status ${response.status}`)
  }

  return response.json() as Promise<T>
}

export function toNumber(value: unknown, fallback = 0): number {
  const numeric = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(numeric) ? numeric : fallback
}
