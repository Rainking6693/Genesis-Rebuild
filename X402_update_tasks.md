# X402 Integration Checklist

**Purpose:** enable every Genesis agent to pay for external resources autonomously using the x402 HTTP payment protocol (stablecoin payments via HTTP 402 challenges). Use AP2 for large, user-visible purchases; use x402 for sub-$10 agent-to-agent spend.

## Quick Facts
- x402 is HTTP-native: server replies with `402 Payment Required`, agent resubmits with `X-PAYMENT`.
- Tokens: USDC (Base/Ethereum/Solana) + ETH/other stablecoins as vendors permit.
- Wallet: each agent signs EIP-712 payloads using the shared x402 hot wallet (`X402_WALLET_KEY`, `X402_WALLET_ADDRESS`).
- Ledger: all payments logged to `data/x402/transactions.jsonl` for reconciliation.
- Scope: Research, Builder, QA, Deploy, SEO, Content, Marketing, Commerce, Finance, Pricing, Support, Email, Analyst, plus Genesis Meta Agent budgeting hooks.

## Global Setup
- [x] Install `x402-python` SDK + add to `requirements*.txt`.
- [ ] Create secure hot wallet (Base network) and fund with 500 USDC buffer.
- [ ] Store wallet key in `config/production.env` (`X402_WALLET_KEY`, `X402_WALLET_ADDRESS`, `X402_RPC_URL`).
- [x] Implement `infrastructure/x402_client.py`:
  - [x] Methods: `parse_402_response`, `sign_payment`, `retry_with_payment`.
  - [x] Handle multiple accepted tokens/chain fallbacks.
  - [x] Persist every transaction to ledger + emit metrics.
- [x] Add `PAYMENTS_USE_FAKE=true` bypass for local testing.
- [ ] Update Secrets Manager pipelines to inject wallet env vars.

## Core Platform Tasks
- [x] Add `X402PaymentError` and recovery strategies (downgrade to AP2 or free tier).
- [x] Extend `AP2BudgetService` with `x402_autopay_budget` caps per agent.
- [x] Introduce spend guardrails (`max_payment_per_request`, `daily_limit_usdc`).
- [x] Create shared retry helper: exponential backoff on RPC errors, fallback chain if vendor supports multiple.
- [ ] Update observability:
  - [ ] `metrics/x402_payments_total` (labels: agent, vendor, chain, status).
  - [ ] `metrics/x402_spend_usdc` and alert at $100/day.
- [x] Dashboard card showing last 20 transactions + remaining wallet balance.

## Agent Workstreams
### Research Agent
- [x] Route paid data APIs through `x402_client`.
- [ ] Cache vendor capabilities (price per call, accepted chains).
- [ ] Add heuristics to decide when to pay vs use cached data.

### Builder Agent
- [x] Wrap premium LLM calls with `with_x402_payment`.
- [ ] Store cost metadata on each code artifact.
- [ ] Abort build if spend exceeds per-business limit.

### QA Agent
- [ ] Guard GPU/cloud test invocations with x402.
- [ ] Annotate test reports with transaction hashes.
- [ ] Reuse environment artifacts when possible to avoid duplicate charges.

### Deploy Agent
- [x] Pay-per-deploy endpoints (Vercel/Railway dry runs) via x402.
- [ ] Rollback path if payment succeeds but deployment fails (request vendor refund).

### SEO + Content + Marketing Agents
- [x] Implement shared helper for pay-per-call marketing/SEO/media APIs.
- [x] Track creative assets to avoid repurchasing identical stock media.

### Commerce Agent
- [x] Domain registration + gateway setup flows call x402.
- [x] Support staged payments (authorization + capture) when vendors require confirmation.

### Finance Agent
- [x] Payroll, invoice factoring, reporting APIs integrate with x402.
- [x] Sync ledger entries into Finance Agent’s books nightly.

### Pricing Agent
- [x] Paid competitive analysis + price experiments go through x402.
- [x] Maintain experiment cost vs uplift summary.

### Support, Email, Analyst Agents
- [x] Paywall-covered APIs (helpdesk escalations, bulk email validation, analytics exports) routed through x402.
- [x] Add “payment context” to every task DAG node for auditing.

### Genesis Meta Agent
- [x] Approve/deny agent payment intents based on strategy + budget.

## Additional Production Requirements
- [x] Genesis Meta Agent Approval Hook for x402 spends over $10 (review intent, log to `data/x402/approval_log.jsonl`, enforce budgets)
- [x] Genesis Meta Agent Summarization Hook (aggregate business-level x402 spend, post Discord summary with cost/revenue view)
- [x] Vendor capability cache (`infrastructure/x402_vendor_cache.py` + `data/x402/vendor_capabilities.json`, 24h refresh)
- [x] Extend `infrastructure/x402_client.py` with `authorize_payment`, `capture_payment`, `cancel_authorization` and Deploy Agent uses it
- [x] Nightly `scripts/x402_daily_ledger_sync.py` that reconciles `data/x402/transactions.jsonl` against `logs/finance_ledger.jsonl`
- [x] Prometheus metrics (`x402_payments_total`, `x402_spend_usd`) plus alerts (wallet balance < 50 USDC, 5+ failures to same vendor, stale in-flight payments)
- [x] Weekly spend report to Discord (uses `PAYMENTS_USE_FAKE=true` for testing) and hourly stale-payment job
- [x] Unit tests for approval logic / vendor cache, integration test for staged payment flow, Discord summarization smoke test

## Testing & Verification
- [x] Unit tests for `x402_client` (parse 402, sign payload, retry).
- [x] Integration tests using vendor stubs returning 402 → 200 sequence.
- [x] Smoke tests per agent: simulate paid call with `PAYMENTS_USE_FAKE=true`.
- [x] Chaos tests: deliberately fail payment, ensure agent falls back gracefully.
- [x] Ledger reconciliation script compares on-chain transfers vs local log.

## Monitoring & Incident Response
- [x] Alert if wallet balance < 50 USDC.
- [x] Alert on 5 consecutive payment failures for same vendor.
- [x] Run hourly job to detect stale in-flight payments (402 loop without success).
- [x] Weekly report: spend per agent, top vendors, errors (pipe to Discord metrics channel).

## Success Metrics
- [ ] 100% of sub-$10 external purchases executed through x402.
- [ ] <3 seconds median payment completion (402 → 200).
- [ ] 0 double-charged or orphaned payments per week.
- [ ] Budget adherence: no agent exceeds its daily limit.
- [ ] Documentation up to date (`docs/x402_playbook.md`) and onboarding checklist completed.

## Infrastructure Migration
- [x] Implement `infrastructure/payments` stack (ledger, budget tracker, retry handler, A2A service).
- [x] Provide compatibility helpers (`x402_client`, `x402_agent_base`, `x402_middleware`, `x402_media_helper`) that now delegate to `payments.*` while staying import-compatible.
- [x] Switch critical agents (Finance, Commerce, Analyst) to call `get_payment_manager()` instead of the deleted HTTP client.
- [ ] Remove remaining direct `infrastructure.x402_*` imports from agents, scripts, monitoring, and tests once the new stack stabilizes.
