"use client"

import { useEffect, useState } from "react"

interface X402Metrics {
  total_payments: number
  total_amount_usd: number
  average_payment: number
  agent_breakdown: Record<string, number>
  recent_payments: Array<{
    agent?: string
    amount_usd: number
    resource?: string
    timestamp?: string
  }>
}

interface WalletEntry {
  agent: string
  balance: number
}

const REFRESH_INTERVAL_MS = 30_000
const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? ""

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format(value)
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2
  }).format(value)
}

export default function X402Page() {
  const [metrics, setMetrics] = useState<X402Metrics | null>(null)
  const [wallets, setWallets] = useState<WalletEntry[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const refreshData = async () => {
    try {
      const metricsResponse = await fetch(`${API_BASE}/api/x402/metrics`)
      const walletsResponse = await fetch(`${API_BASE}/api/x402/wallets`)

      if (!metricsResponse.ok || !walletsResponse.ok) {
        throw new Error("Failed to fetch x402 dashboard data")
      }

      const metricsPayload = (await metricsResponse.json()) as X402Metrics
      const walletsPayload = (await walletsResponse.json()) as { wallets: Record<string, number> }

      setMetrics(metricsPayload)
      setWallets(
        Object.entries(walletsPayload.wallets ?? {})
          .map(([agent, balance]) => ({ agent, balance }))
          .sort((a, b) => b.balance - a.balance)
      )
      setError(null)
    } catch (err) {
      console.error("x402 dashboard fetch failed:", err)
      setError("Unable to load x402 metrics right now.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
    const interval = setInterval(refreshData, REFRESH_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [])

  const topAgents = metrics
    ? Object.entries(metrics.agent_breakdown || {})
        .sort(([, a], [, b]) => b - a)
        .slice(0, 6)
    : []

  if (loading && !metrics) {
    return (
      <div className="p-10 text-lg text-slate-200">
        <p>Loading x402 dashboard…</p>
      </div>
    )
  }

  return (
    <div style={{ padding: "2rem", color: "#e2e8f0" }}>
      <header>
        <p style={{ textTransform: "uppercase", letterSpacing: "0.1em", color: "#94a3b8" }}>Cost & Wallets</p>
        <h1 style={{ fontSize: "2.4rem", margin: "0.25rem 0 1rem" }}>x402 Operations Insights</h1>
        <p style={{ maxWidth: "640px", color: "#cbd5f5" }}>
          Live metrics pulled from `/api/x402/metrics` plus wallet balances from `/api/x402/wallets`. The data refreshes
          automatically every 30 seconds.
        </p>
      </header>

      {error && (
        <div
          style={{
            background: "#b91c1c",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            marginTop: "1rem"
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      )}

      <section
        style={{
          marginTop: "2rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem"
        }}
      >
        <article className="card">
          <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Total Payments</div>
          <div style={{ fontSize: "2rem", fontWeight: 700 }}>
            {metrics ? formatNumber(metrics.total_payments) : "0"}
          </div>
          <div style={{ fontSize: "0.85rem", color: "#a5b4fc" }}>Includes the last 10 recorded events</div>
        </article>

        <article className="card">
          <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Total Spend</div>
          <div style={{ fontSize: "2rem", fontWeight: 700 }}>
            {metrics ? formatCurrency(metrics.total_amount_usd) : "$0.00"}
          </div>
          <div style={{ fontSize: "0.85rem", color: "#a5b4fc" }}>Real-time spending tracked via BusinessMonitor</div>
        </article>

        <article className="card">
          <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Average x402 Payment</div>
          <div style={{ fontSize: "2rem", fontWeight: 700 }}>
            {metrics ? formatCurrency(metrics.average_payment) : "$0.00"}
          </div>
          <div style={{ fontSize: "0.85rem", color: "#a5b4fc" }}>Useful for spotting anomalous spikes.</div>
        </article>

        <article className="card">
          <div style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Monitored Agents</div>
          <div style={{ fontSize: "2rem", fontWeight: 700 }}>{topAgents.length}</div>
          <div style={{ fontSize: "0.85rem", color: "#a5b4fc" }}>Top spenders displayed below.</div>
        </article>
      </section>

      <section style={{ marginTop: "2rem", display: "grid", gap: "1rem" }}>
        <div>
          <h2 style={{ margin: "0 0 0.5rem" }}>Top Spending Agents</h2>
          <div
            style={{
              background: "#0f172a",
              borderRadius: "8px",
              border: "1px solid #1e293b",
              padding: "1rem"
            }}
          >
            {topAgents.length === 0 && <p>No spend data yet</p>}
            {topAgents.map(([agent, value]) => (
              <div
                key={agent}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0.4rem 0",
                  borderBottom: "1px solid #1e293b"
                }}
              >
                <span style={{ color: "#e2e8f0" }}>{agent}</span>
                <span style={{ color: "#38bdf8" }}>{formatCurrency(value)}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 style={{ margin: "0 0 0.5rem" }}>Wallet Balances</h2>
          <div
            style={{
              background: "#0f172a",
              borderRadius: "8px",
              border: "1px solid #1e293b",
              padding: "1rem"
            }}
          >
            {wallets.length === 0 && <p>No wallet data</p>}
            {wallets.slice(0, 8).map((wallet) => (
              <div
                key={wallet.agent}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0.4rem 0",
                  borderBottom: "1px solid #1e293b"
                }}
              >
                <span style={{ color: "#e2e8f0" }}>{wallet.agent}</span>
                <span style={{ color: wallet.balance < 10 ? "#f97316" : "#4ade80" }}>
                  {formatCurrency(wallet.balance)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2 style={{ margin: "0 0 0.75rem" }}>Recent Transactions</h2>
        <div
          style={{
            background: "#0f172a",
            borderRadius: "8px",
            border: "1px solid #1e293b",
            padding: "1rem"
          }}
        >
          {metrics?.recent_payments.length ? (
            metrics.recent_payments.map((entry, index) => (
              <div
                key={`${entry.agent ?? "agent"}-${index}`}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0.35rem 0",
                  borderBottom: index === metrics.recent_payments.length - 1 ? "none" : "1px solid #1e293b"
                }}
              >
                <div>
                  <p style={{ margin: 0 }}>{entry.agent ?? "unknown agent"}</p>
                  <small style={{ color: "#94a3b8" }}>{entry.resource || "resource"}</small>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: 0 }}>{formatCurrency(entry.amount_usd)}</p>
                  <small style={{ color: "#94a3b8" }}>
                    {entry.timestamp ? new Date(entry.timestamp).toLocaleTimeString() : "—"}
                  </small>
                </div>
              </div>
            ))
          ) : (
            <p>No transactions yet</p>
          )}
        </div>
      </section>
    </div>
  )
}
