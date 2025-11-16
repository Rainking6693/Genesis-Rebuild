# x402 Payment Protocol Integration Plan for Genesis

**Last Updated:** November 15, 2025
**Status:** Planning Phase - Complete Coverage (ALL 13 AP2 Agents)
**Priority:** CRITICAL (Enable autonomous agent payments without human approval)

---

## Executive Summary

This plan integrates **x402 payment protocol** into Genesis to enable **ALL 13 agents with AP2 integration** to make autonomous payments for resources, APIs, and services without human intervention.

**What is x402:**
- HTTP-native payment protocol (uses HTTP 402 "Payment Required" status code)
- Enables instant stablecoin payments (USDC, etc.) via blockchain
- Chain-agnostic (supports Ethereum, Base, Solana, etc.)
- Zero protocol fees, 2-second settlement
- Built for AI agents (no OAuth, no registration, no human approval)

**Why Genesis Needs x402:**
- **Current Problem:** Genesis agents can't pay for paid APIs autonomously
- **AP2 Limitation:** AP2 requires human approval for every purchase
- **x402 Solution:** Agents pay instantly for resources using crypto wallets
- **Scope:** 13 agents need autonomous payment capability

**Agents Covered (13 Total):**
1. Research Agent - Premium data APIs
2. Builder Agent - LLM APIs, code generation
3. QA Agent - Cloud compute
4. Deploy Agent - Serverless compute
5. SEO Agent - SEO tools
6. Content Agent - Stock media
7. Marketing Agent - Ad platforms
8. **Commerce Agent** - Domains, payment gateways, tax APIs
9. **Finance Agent** - Payroll, invoicing, reports
10. **Pricing Agent** - Pricing intelligence, experiments
11. **Support Agent** - Helpdesk, live chat, transcription
12. **Email Agent** - Email services, validation
13. **Analyst Agent** - Analytics, data warehouses
14. Genesis Meta Agent - Orchestration, premium LLMs

**Combined Strategy:**
- **AP2:** User-facing payments requiring approval (>$10: domain registration, hosting plans, marketing campaigns)
- **x402:** Agent-to-agent micropayments without approval (<$10: API calls, compute time, data access)

---

## Part 1: x402 Protocol Overview

### 1.1 How x402 Works

**Payment Flow:**

1. **Client requests resource:**
   ```http
   GET /api/premium-data HTTP/1.1
   Host: api.example.com
   ```

2. **Server responds with 402 Payment Required:**
   ```http
   HTTP/1.1 402 Payment Required
   X-ACCEPT-PAYMENT: usdc:ethereum, usdc:base, eth:ethereum
   X-PAYMENT-AMOUNT: 0.01
   X-PAYMENT-ADDRESS: 0xABCD1234...
   X-PAYMENT-CHAIN: base
   Content-Type: application/json

   {
     "error": "Payment required",
     "price": "0.01 USDC",
     "accepted_tokens": ["USDC on Base", "USDC on Ethereum", "ETH on Ethereum"],
     "payment_address": "0xABCD1234...",
     "chain": "base"
   }
   ```

3. **Client signs payment (EIP-712):**
   ```python
   # Agent generates signed payment
   payment = wallet.sign_eip712_payment(
       amount="0.01",
       token="USDC",
       chain="base",
       recipient="0xABCD1234..."
   )
   ```

4. **Client retries with payment:**
   ```http
   GET /api/premium-data HTTP/1.1
   Host: api.example.com
   X-PAYMENT: 0xSIGNED_PAYMENT_HASH...
   ```

5. **Server validates payment and returns resource:**
   ```http
   HTTP/1.1 200 OK
   X-PAYMENT-RESPONSE: confirmed
   X-TRANSACTION-HASH: 0xTXN_HASH...
   Content-Type: application/json

   {
     "data": "Premium data here...",
     "transaction": "0xTXN_HASH..."
   }
   ```

---

### 1.2 x402 vs AP2 Comparison

| Feature | AP2 (Agent Payments Protocol) | x402 (HTTP Payment Protocol) |
|---------|-------------------------------|------------------------------|
| **Purpose** | User-facing purchases requiring approval | Agent-to-agent micropayments |
| **Approval** | Human approval required (>$50) | Fully autonomous (no human) |
| **Payment Method** | Credit cards, bank transfers, crypto | Stablecoins only (USDC, etc.) |
| **Use Cases** | Domain registration, hosting, marketing campaigns | API calls, compute time, data feeds |
| **Cost Range** | $10-10,000 per transaction | $0.001-10 per transaction |
| **Settlement Time** | 1-3 business days | 2 seconds (blockchain) |
| **Integration** | Custom (Genesis-specific) | Standard HTTP protocol |
| **Agent Autonomy** | Limited (requires user consent) | Full (agents pay autonomously) |

**Combined Strategy:**
- Use **AP2** for large, user-visible purchases (domain names, hosting plans, ad campaigns)
- Use **x402** for small, autonomous agent payments (API calls, data access, compute)

---

## Part 2: Genesis Use Cases for x402

### 2.1 Research Agent - Paid Data APIs

**Current:** Research Agent limited to free APIs (unreliable, rate-limited)
**With x402:** Access premium data feeds autonomously

**Use Case:**
```python
# Research Agent needs premium market data
response = requests.get(
    'https://api.premium-data.com/stock-prices',
    params={'symbol': 'AAPL'}
)

if response.status_code == 402:
    # Server requires payment: 0.001 USDC per request
    payment_info = response.headers['X-PAYMENT-AMOUNT']  # "0.001"

    # Agent pays autonomously
    payment = x402_client.create_payment(
        amount=payment_info,
        token='USDC',
        chain='base',
        recipient=response.headers['X-PAYMENT-ADDRESS']
    )

    # Retry with payment
    response = requests.get(
        'https://api.premium-data.com/stock-prices',
        params={'symbol': 'AAPL'},
        headers={'X-PAYMENT': payment.signature}
    )

    # Now response.status_code == 200 with premium data
```

**Impact:**
- Access to premium data sources (Bloomberg, Reuters, etc.)
- No rate limits (pay per request)
- Better business intelligence

---

### 2.2 Builder Agent - Paid LLM APIs

**Current:** Builder Agent uses Genesis-provided LLM credits
**With x402:** Access best-in-class models autonomously

**Use Case:**
```python
# Builder Agent needs GPT-4.5 for complex code generation
response = requests.post(
    'https://api.openai-x402.com/v1/completions',
    json={
        'model': 'gpt-4.5-turbo',
        'prompt': 'Generate a React component for...',
        'max_tokens': 2000
    }
)

if response.status_code == 402:
    # Cost: 0.06 USDC per 1K tokens = 0.12 USDC for 2K tokens
    payment = x402_client.create_payment(
        amount=response.headers['X-PAYMENT-AMOUNT'],
        token='USDC',
        chain='base'
    )

    # Retry with payment
    response = requests.post(
        'https://api.openai-x402.com/v1/completions',
        json=...,
        headers={'X-PAYMENT': payment.signature}
    )
```

**Impact:**
- Access to latest models (GPT-4.5, Claude 3.5 Opus, etc.)
- Pay per token (no monthly subscriptions)
- Cost-efficient (only pay for what you use)

---

### 2.3 QA Agent - Cloud Compute for Testing

**Current:** QA Agent runs tests on local machine (limited resources)
**With x402:** Rent cloud compute per second

**Use Case:**
```python
# QA Agent needs GPU for visual regression testing
response = requests.post(
    'https://compute.x402.cloud/run-test',
    json={
        'test_suite': 'visual-regression',
        'duration_seconds': 300,
        'gpu_type': 'A100'
    }
)

if response.status_code == 402:
    # Cost: 0.50 USDC per minute = 2.50 USDC for 5 minutes
    payment = x402_client.create_payment(
        amount=response.headers['X-PAYMENT-AMOUNT'],
        token='USDC',
        chain='base'
    )

    # Compute starts immediately after payment
    response = requests.post(
        'https://compute.x402.cloud/run-test',
        json=...,
        headers={'X-PAYMENT': payment.signature}
    )

    # Response includes test results
```

**Impact:**
- On-demand GPU compute
- Pay per second (no idle costs)
- Faster test execution

---

### 2.4 SEO Agent - Premium SEO Tools

**Current:** SEO Agent limited to free tools (Ahrefs/SEMrush require subscriptions)
**With x402:** Pay per API call

**Use Case:**
```python
# SEO Agent needs backlink analysis
response = requests.get(
    'https://api.ahrefs-x402.com/backlinks',
    params={'domain': 'example.com'}
)

if response.status_code == 402:
    # Cost: 0.10 USDC per domain analysis
    payment = x402_client.create_payment(
        amount=response.headers['X-PAYMENT-AMOUNT'],
        token='USDC',
        chain='base'
    )

    # Get backlink data
    response = requests.get(
        'https://api.ahrefs-x402.com/backlinks',
        params={'domain': 'example.com'},
        headers={'X-PAYMENT': payment.signature}
    )
```

**Impact:**
- No monthly subscriptions ($99-399/month)
- Pay per analysis (10-100x cheaper)
- Access to all SEO tools

---

### 2.5 Deploy Agent - Serverless Compute

**Current:** Deploy Agent uses fixed hosting plans
**With x402:** Pay per function invocation

**Use Case:**
```python
# Deploy Agent deploys serverless function
response = requests.post(
    'https://serverless.x402.cloud/deploy',
    json={
        'function_code': '...',
        'runtime': 'nodejs18',
        'memory_mb': 512
    }
)

if response.status_code == 402:
    # Cost: 0.001 USDC per 1M invocations
    payment = x402_client.create_payment(
        amount=response.headers['X-PAYMENT-AMOUNT'],
        token='USDC',
        chain='base'
    )

    # Function deployed
    response = requests.post(
        'https://serverless.x402.cloud/deploy',
        json=...,
        headers={'X-PAYMENT': payment.signature}
    )
```

**Impact:**
- True serverless (pay per invocation)
- No cold start fees
- Multi-cloud (any x402-enabled provider)

---

### 2.6 Content Agent - Stock Media

**Current:** Content Agent limited to free stock images (low quality)
**With x402:** Purchase premium media per asset

**Use Case:**
```python
# Content Agent needs high-res stock photo
response = requests.get(
    'https://stock.x402.media/download/12345',
    params={'resolution': '4K'}
)

if response.status_code == 402:
    # Cost: 0.50 USDC per 4K image
    payment = x402_client.create_payment(
        amount=response.headers['X-PAYMENT-AMOUNT'],
        token='USDC',
        chain='base'
    )

    # Download 4K image
    response = requests.get(
        'https://stock.x402.media/download/12345',
        params={'resolution': '4K'},
        headers={'X-PAYMENT': payment.signature}
    )
```

**Impact:**
- No subscriptions (Shutterstock $29-249/month)
- Pay per asset (0.50-5 USDC)
- Access to premium libraries

---

### 2.7 Commerce Agent - Paid Commerce Stack Resources

**Current:** Commerce Agent limited to free payment gateways and basic tax calculators
**With x402:** Access premium commerce infrastructure autonomously

**Use Case:**
```python
# Commerce Agent needs domain registration for new store
response = requests.post(
    'https://domain-api.x402.com/register',
    json={
        'domain': 'mystore.com',
        'years': 1,
        'auto_renew': True
    }
)

if response.status_code == 402:
    # Cost: 12.99 USDC for .com domain registration
    payment = x402_client.create_payment(
        amount=response.headers['X-PAYMENT-AMOUNT'],
        token='USDC',
        chain='base',
        recipient=response.headers['X-PAYMENT-ADDRESS']
    )

    # Retry with payment
    response = requests.post(
        'https://domain-api.x402.com/register',
        json=...,
        headers={'X-PAYMENT': payment.signature}
    )

# Commerce Agent needs premium payment gateway integration
response = requests.post(
    'https://payment-gateway.x402.com/setup',
    json={
        'gateway': 'stripe',
        'features': ['fraud_detection', 'recurring_billing', 'multi_currency']
    }
)

if response.status_code == 402:
    # Cost: 2.00 USDC for premium gateway setup
    payment = x402_client.create_payment(
        amount=response.headers['X-PAYMENT-AMOUNT'],
        token='USDC',
        chain='base'
    )

    response = requests.post(
        'https://payment-gateway.x402.com/setup',
        json=...,
        headers={'X-PAYMENT': payment.signature}
    )

# Commerce Agent needs real-time tax calculation API
response = requests.get(
    'https://tax-api.x402.com/calculate',
    params={
        'amount': 99.99,
        'country': 'US',
        'state': 'CA',
        'product_category': 'digital_goods'
    }
)

if response.status_code == 402:
    # Cost: 0.05 USDC per tax calculation
    payment = x402_client.create_payment(
        amount=response.headers['X-PAYMENT-AMOUNT'],
        token='USDC',
        chain='base'
    )

    response = requests.get(
        'https://tax-api.x402.com/calculate',
        params=...,
        headers={'X-PAYMENT': payment.signature}
    )
```

**Impact:**
- Domain registration: $12.99/domain (vs manual registration)
- Payment gateway setup: $2.00 one-time (vs $49-99/month subscriptions)
- Tax calculations: $0.05/calculation (vs $49/month TaxJar/Avalara)
- Shipping rate APIs: $0.10/quote (vs carrier account setup)
- Fraud detection: $0.25/transaction (vs $99/month subscription)

**Cost Savings:**
- <100 transactions/month: x402 = $50, Subscription = $200+ (75% savings)
- 100-500 transactions/month: Break-even point
- >500 transactions/month: Subscriptions become cheaper

---

### 2.8 Finance Agent - Treasury Operations APIs

**Current:** Finance Agent limited to manual invoice processing and basic accounting
**With x402:** Access premium finance infrastructure and real-time data

**Use Case:**
```python
# Finance Agent needs automated payroll processing
response = requests.post(
    'https://payroll-api.x402.com/process',
    json={
        'employees': [...],
        'period': '2025-01-15',
        'deductions': ['taxes', '401k', 'insurance']
    }
)

if response.status_code == 402:
    # Cost: 5.00 USDC per payroll run (vs $39/month Gusto)
    payment = x402_client.create_payment(
        amount=response.headers['X-PAYMENT-AMOUNT'],
        token='USDC',
        chain='base'
    )

    response = requests.post(
        'https://payroll-api.x402.com/process',
        json=...,
        headers={'X-PAYMENT': payment.signature}
    )

# Finance Agent needs real-time invoice factoring
response = requests.post(
    'https://factoring-api.x402.com/quote',
    json={
        'invoice_amount': 10000.00,
        'due_date': '2025-02-15',
        'customer_creditworthiness': 'A'
    }
)

if response.status_code == 402:
    # Cost: 1.00 USDC for factoring quote (instant cash flow)
    payment = x402_client.create_payment(
        amount=response.headers['X-PAYMENT-AMOUNT'],
        token='USDC',
        chain='base'
    )

    response = requests.post(
        'https://factoring-api.x402.com/quote',
        json=...,
        headers={'X-PAYMENT': payment.signature}
    )

# Finance Agent needs premium financial reporting
response = requests.get(
    'https://finance-reports.x402.com/generate',
    params={
        'report_type': 'cash_flow_forecast',
        'period': '90_days',
        'format': 'pdf'
    }
)

if response.status_code == 402:
    # Cost: 2.00 USDC per premium report
    payment = x402_client.create_payment(
        amount=response.headers['X-PAYMENT-AMOUNT'],
        token='USDC',
        chain='base'
    )

    response = requests.get(
        'https://finance-reports.x402.com/generate',
        params=...,
        headers={'X-PAYMENT': payment.signature}
    )
```

**Impact:**
- Payroll processing: $5/run (vs $39-149/month QuickBooks/Gusto)
- Invoice factoring: $1/quote + 2-3% fee (vs manual bank negotiations)
- Financial reports: $2/report (vs $50-200/month accounting software)
- Bank feed integrations: $0.50/month per account (vs $10/month Plaid)
- Credit monitoring: $0.10/check (vs $29/month Experian Business)

**Cost Savings:**
- <10 payroll runs/month: x402 = $50, Subscription = $150+ (67% savings)
- Financial reports on-demand: 90% cheaper than monthly subscriptions

---

### 2.9 Pricing Agent - Pricing Data & Experimentation

**Current:** Pricing Agent uses basic price comparisons and static rules
**With x402:** Access real-time market data and run pricing experiments

**Use Case:**
```python
# Pricing Agent needs competitive pricing data
response = requests.get(
    'https://pricing-intelligence.x402.com/competitive-analysis',
    params={
        'product': 'saas_project_management',
        'features': ['team_size_10', 'unlimited_projects', 'api_access'],
        'competitors': 5
    }
)

if response.status_code == 402:
    # Cost: 0.50 USDC per competitive analysis
    payment = x402_client.create_payment(
        amount=response.headers['X-PAYMENT-AMOUNT'],
        token='USDC',
        chain='base'
    )

    response = requests.get(
        'https://pricing-intelligence.x402.com/competitive-analysis',
        params=...,
        headers={'X-PAYMENT': payment.signature}
    )

# Pricing Agent runs price elasticity experiment
response = requests.post(
    'https://pricing-experiments.x402.com/run',
    json={
        'experiment_type': 'price_elasticity',
        'current_price': 49.00,
        'test_prices': [39.00, 44.00, 54.00, 59.00],
        'sample_size': 1000,
        'duration_days': 7
    }
)

if response.status_code == 402:
    # Cost: 10.00 USDC for 7-day pricing experiment with 1000 samples
    payment = x402_client.create_payment(
        amount=response.headers['X-PAYMENT-AMOUNT'],
        token='USDC',
        chain='base'
    )

    response = requests.post(
        'https://pricing-experiments.x402.com/run',
        json=...,
        headers={'X-PAYMENT': payment.signature}
    )

# Pricing Agent gets dynamic price recommendations
response = requests.post(
    'https://pricing-ai.x402.com/recommend',
    json={
        'product_category': 'saas',
        'customer_segment': 'small_business',
        'market_conditions': {...},
        'cost_structure': {...}
    }
)

if response.status_code == 402:
    # Cost: 1.00 USDC per AI pricing recommendation
    payment = x402_client.create_payment(
        amount=response.headers['X-PAYMENT-AMOUNT'],
        token='USDC',
        chain='base'
    )

    response = requests.post(
        'https://pricing-ai.x402.com/recommend',
        json=...,
        headers={'X-PAYMENT': payment.signature}
    )
```

**Impact:**
- Competitive pricing data: $0.50/analysis (vs $299/month Price2Spy)
- Price elasticity tests: $10/experiment (vs $2,000+ consultants)
- Dynamic pricing AI: $1/recommendation (vs $499/month Prisync)
- Market intelligence: $0.25/query (vs $99/month subscriptions)
- Real-time price updates: $0.10/update (vs manual monitoring)

**Cost Savings:**
- <200 pricing queries/month: x402 = $100, Subscription = $500+ (80% savings)
- Pricing experiments: 99% cheaper than hiring consultants

---

### 2.10 Support Agent - Support Platform Services

**Current:** Support Agent uses basic email support only
**With x402:** Access premium helpdesk, live chat, and voice support infrastructure

**Use Case:**
```python
# Support Agent needs helpdesk ticket creation
response = requests.post(
    'https://helpdesk.x402.com/create-ticket',
    json={
        'customer_email': 'user@example.com',
        'subject': 'Payment issue',
        'priority': 'high',
        'category': 'billing'
    }
)

if response.status_code == 402:
    # Cost: 0.10 USDC per ticket (vs $49/month Zendesk for 3 agents)
    payment = x402_client.create_payment(
        amount=response.headers['X-PAYMENT-AMOUNT'],
        token='USDC',
        chain='base'
    )

    response = requests.post(
        'https://helpdesk.x402.com/create-ticket',
        json=...,
        headers={'X-PAYMENT': payment.signature}
    )

# Support Agent needs live chat session
response = requests.post(
    'https://livechat.x402.com/start-session',
    json={
        'customer_id': 'cust_12345',
        'language': 'en',
        'routing': 'ai_agent'
    }
)

if response.status_code == 402:
    # Cost: 0.50 USDC per live chat session (vs $39/month Intercom)
    payment = x402_client.create_payment(
        amount=response.headers['X-PAYMENT-AMOUNT'],
        token='USDC',
        chain='base'
    )

    response = requests.post(
        'https://livechat.x402.com/start-session',
        json=...,
        headers={'X-PAYMENT': payment.signature}
    )

# Support Agent needs voice support transcription
response = requests.post(
    'https://voice-support.x402.com/transcribe',
    json={
        'audio_url': 'https://recordings.example.com/call_123.mp3',
        'duration_seconds': 300,
        'language': 'en'
    }
)

if response.status_code == 402:
    # Cost: 0.05 USDC per minute of transcription
    payment = x402_client.create_payment(
        amount=response.headers['X-PAYMENT-AMOUNT'],  # 0.25 USDC for 5 min
        token='USDC',
        chain='base'
    )

    response = requests.post(
        'https://voice-support.x402.com/transcribe',
        json=...,
        headers={'X-PAYMENT': payment.signature}
    )

# Support Agent needs sentiment analysis on customer feedback
response = requests.post(
    'https://sentiment-api.x402.com/analyze',
    json={
        'text': 'Customer feedback text here...',
        'language': 'en',
        'detailed': True
    }
)

if response.status_code == 402:
    # Cost: 0.02 USDC per sentiment analysis
    payment = x402_client.create_payment(
        amount=response.headers['X-PAYMENT-AMOUNT'],
        token='USDC',
        chain='base'
    )

    response = requests.post(
        'https://sentiment-api.x402.com/analyze',
        json=...,
        headers={'X-PAYMENT': payment.signature}
    )
```

**Impact:**
- Helpdesk tickets: $0.10/ticket (vs $49-99/month for 3-agent Zendesk plan)
- Live chat: $0.50/session (vs $39/month Intercom)
- Voice transcription: $0.05/minute (vs $0.25/min traditional services)
- Sentiment analysis: $0.02/analysis (vs $299/month MonkeyLearn)
- Knowledge base queries: $0.01/query (vs $99/month Document360)

**Cost Savings:**
- <500 tickets/month: x402 = $50, Subscription = $150+ (67% savings)
- <100 live chats/month: x402 = $50, Subscription = $39 (break-even ~80 chats)
- Voice transcription: 80% cheaper than traditional services

---

### 2.11 Email Agent - Email Service Providers

**Current:** Email Agent limited to basic SMTP or free tier SendGrid (100 emails/day)
**With x402:** Access premium email infrastructure with deliverability optimization

**Use Case:**
```python
# Email Agent sends transactional email
response = requests.post(
    'https://email-api.x402.com/send',
    json={
        'to': 'user@example.com',
        'from': 'noreply@myapp.com',
        'subject': 'Welcome to MyApp',
        'template_id': 'welcome_v2',
        'personalization': {...},
        'tracking': ['opens', 'clicks']
    }
)

if response.status_code == 402:
    # Cost: 0.0002 USDC per email (vs $0.001 SendGrid)
    payment = x402_client.create_payment(
        amount=response.headers['X-PAYMENT-AMOUNT'],
        token='USDC',
        chain='base'
    )

    response = requests.post(
        'https://email-api.x402.com/send',
        json=...,
        headers={'X-PAYMENT': payment.signature}
    )

# Email Agent validates email deliverability
response = requests.post(
    'https://email-validation.x402.com/verify',
    json={
        'email': 'potential-customer@example.com',
        'check_smtp': True,
        'check_disposable': True,
        'check_reputation': True
    }
)

if response.status_code == 402:
    # Cost: 0.001 USDC per email validation
    payment = x402_client.create_payment(
        amount=response.headers['X-PAYMENT-AMOUNT'],
        token='USDC',
        chain='base'
    )

    response = requests.post(
        'https://email-validation.x402.com/verify',
        json=...,
        headers={'X-PAYMENT': payment.signature}
    )

# Email Agent needs email warmup service
response = requests.post(
    'https://email-warmup.x402.com/start',
    json={
        'domain': 'myapp.com',
        'daily_volume': 50,
        'duration_days': 14
    }
)

if response.status_code == 402:
    # Cost: 5.00 USDC for 14-day email warmup (vs $29/month Warmup Inbox)
    payment = x402_client.create_payment(
        amount=response.headers['X-PAYMENT-AMOUNT'],
        token='USDC',
        chain='base'
    )

    response = requests.post(
        'https://email-warmup.x402.com/start',
        json=...,
        headers={'X-PAYMENT': payment.signature}
    )
```

**Impact:**
- Transactional emails: $0.0002/email (vs $0.001 SendGrid = 80% savings)
- Email validation: $0.001/email (vs $0.008 ZeroBounce = 87% savings)
- Email warmup: $5/campaign (vs $29/month subscription = 83% savings for one-time)
- Deliverability monitoring: $0.05/report (vs $99/month GlockApps)
- Spam testing: $0.10/test (vs $49/month Mail Tester)

**Cost Savings:**
- <10,000 emails/month: x402 = $2, SendGrid free tier = $0 (but limited features)
- 10,000-100,000 emails/month: x402 = $20, SendGrid = $100+ (80% savings)
- Email validation: 87% cheaper than traditional services

---

### 2.12 Analyst Agent - Analytics & BI Platforms

**Current:** Analyst Agent limited to basic Google Analytics and manual data analysis
**With x402:** Access premium analytics, BI tools, and real-time data warehouses

**Use Case:**
```python
# Analyst Agent needs advanced funnel analysis
response = requests.post(
    'https://analytics-pro.x402.com/funnel-analysis',
    json={
        'funnel_steps': ['landing', 'signup', 'trial', 'paid'],
        'date_range': '2025-01-01:2025-01-31',
        'segment_by': ['traffic_source', 'device', 'country'],
        'cohort_analysis': True
    }
)

if response.status_code == 402:
    # Cost: 1.00 USDC per advanced funnel analysis
    payment = x402_client.create_payment(
        amount=response.headers['X-PAYMENT-AMOUNT'],
        token='USDC',
        chain='base'
    )

    response = requests.post(
        'https://analytics-pro.x402.com/funnel-analysis',
        json=...,
        headers={'X-PAYMENT': payment.signature}
    )

# Analyst Agent needs real-time data warehouse query
response = requests.post(
    'https://data-warehouse.x402.com/query',
    json={
        'sql': 'SELECT user_id, SUM(revenue) FROM transactions WHERE date >= "2025-01-01" GROUP BY user_id',
        'warehouse': 'snowflake',
        'compute_size': 'medium'
    }
)

if response.status_code == 402:
    # Cost: 0.50 USDC per query (vs $40/credit Snowflake = 98% savings)
    payment = x402_client.create_payment(
        amount=response.headers['X-PAYMENT-AMOUNT'],
        token='USDC',
        chain='base'
    )

    response = requests.post(
        'https://data-warehouse.x402.com/query',
        json=...,
        headers={'X-PAYMENT': payment.signature}
    )

# Analyst Agent generates predictive analytics report
response = requests.post(
    'https://predictive-analytics.x402.com/forecast',
    json={
        'metric': 'monthly_revenue',
        'historical_data': [...],
        'forecast_months': 6,
        'model': 'prophet'
    }
)

if response.status_code == 402:
    # Cost: 2.00 USDC per predictive model run
    payment = x402_client.create_payment(
        amount=response.headers['X-PAYMENT-AMOUNT'],
        token='USDC',
        chain='base'
    )

    response = requests.post(
        'https://predictive-analytics.x402.com/forecast',
        json=...,
        headers={'X-PAYMENT': payment.signature}
    )

# Analyst Agent needs customer lifetime value (LTV) calculation
response = requests.post(
    'https://analytics-ai.x402.com/calculate-ltv',
    json={
        'customer_data': [...],
        'time_horizon_months': 24,
        'discount_rate': 0.10,
        'include_churn_prediction': True
    }
)

if response.status_code == 402:
    # Cost: 0.25 USDC per LTV calculation batch
    payment = x402_client.create_payment(
        amount=response.headers['X-PAYMENT-AMOUNT'],
        token='USDC',
        chain='base'
    )

    response = requests.post(
        'https://analytics-ai.x402.com/calculate-ltv',
        json=...,
        headers={'X-PAYMENT': payment.signature}
    )
```

**Impact:**
- Funnel analysis: $1/analysis (vs $299/month Mixpanel)
- Data warehouse queries: $0.50/query (vs $40/credit Snowflake = 98% savings)
- Predictive analytics: $2/forecast (vs $500/month third-party platforms)
- LTV calculations: $0.25/batch (vs manual analysis time)
- Cohort analysis: $0.50/cohort (vs $199/month Amplitude)

**Cost Savings:**
- <300 analytics queries/month: x402 = $150, Subscription = $500+ (70% savings)
- Data warehouse: Pay-per-query eliminates idle compute costs
- Predictive models: 99% cheaper than consultant fees

---

### 2.13 Genesis Meta Agent - LLM & Infrastructure APIs

**Current:** Genesis Meta Agent uses pre-allocated LLM credits and basic infrastructure
**With x402:** Access premium LLMs, specialized models, and on-demand compute

**Use Case:**
```python
# Genesis Meta Agent needs GPT-4.5 for complex orchestration
response = requests.post(
    'https://llm-api.x402.com/completions',
    json={
        'model': 'gpt-4.5-turbo',
        'messages': [...],
        'max_tokens': 4000,
        'temperature': 0.7
    }
)

if response.status_code == 402:
    # Cost: 0.12 USDC for 4000 tokens (input + output)
    payment = x402_client.create_payment(
        amount=response.headers['X-PAYMENT-AMOUNT'],
        token='USDC',
        chain='base'
    )

    response = requests.post(
        'https://llm-api.x402.com/completions',
        json=...,
        headers={'X-PAYMENT': payment.signature}
    )

# Genesis Meta Agent needs specialized code generation model
response = requests.post(
    'https://code-llm.x402.com/generate',
    json={
        'model': 'codellama-70b',
        'prompt': 'Generate a React component for...',
        'language': 'typescript',
        'max_tokens': 2000
    }
)

if response.status_code == 402:
    # Cost: 0.08 USDC for specialized code model
    payment = x402_client.create_payment(
        amount=response.headers['X-PAYMENT-AMOUNT'],
        token='USDC',
        chain='base'
    )

    response = requests.post(
        'https://code-llm.x402.com/generate',
        json=...,
        headers={'X-PAYMENT': payment.signature}
    )

# Genesis Meta Agent needs multi-agent orchestration compute
response = requests.post(
    'https://orchestration-compute.x402.com/run',
    json={
        'agent_count': 21,
        'parallel_tasks': 10,
        'duration_minutes': 15,
        'compute_tier': 'optimized'
    }
)

if response.status_code == 402:
    # Cost: 5.00 USDC for 15 minutes of orchestration compute
    payment = x402_client.create_payment(
        amount=response.headers['X-PAYMENT-AMOUNT'],
        token='USDC',
        chain='base'
    )

    response = requests.post(
        'https://orchestration-compute.x402.com/run',
        json=...,
        headers={'X-PAYMENT': payment.signature}
    )

# Genesis Meta Agent needs prompt optimization API
response = requests.post(
    'https://prompt-optimizer.x402.com/optimize',
    json={
        'base_prompt': 'Original prompt text...',
        'optimization_goal': 'reduce_tokens',
        'maintain_quality': True,
        'test_iterations': 5
    }
)

if response.status_code == 402:
    # Cost: 1.00 USDC for prompt optimization with testing
    payment = x402_client.create_payment(
        amount=response.headers['X-PAYMENT-AMOUNT'],
        token='USDC',
        chain='base'
    )

    response = requests.post(
        'https://prompt-optimizer.x402.com/optimize',
        json=...,
        headers={'X-PAYMENT': payment.signature}
    )
```

**Impact:**
- Premium LLM access: $0.12/4K tokens (pay-per-use, no subscription)
- Specialized models: $0.08/request (vs training own models = $10,000+)
- Orchestration compute: $5/15min (vs $200/month reserved instances)
- Prompt optimization: $1/optimization (vs $500/month third-party tools)
- Multi-model routing: $0.05/routing decision (automatic cost optimization)

**Cost Savings:**
- <100K tokens/month: x402 = $300, OpenAI subscription = $500+ (40% savings)
- Orchestration compute: Pay only when running (vs 24/7 server costs)
- Specialized models: 99% cheaper than training from scratch

---

## Part 3: x402 Architecture for Genesis

### 3.1 High-Level Architecture

```
Genesis Agent → HTTP Request (needs paid resource)
     ↓
[x402 Client Middleware]
     ↓
HTTP 402 Payment Required ← Resource Server
     ↓
[x402 Client] generates signed payment
     ↓
     → Blockchain (Base, Ethereum, Solana)
     ↓
Payment confirmed (2 seconds)
     ↓
HTTP Request with X-PAYMENT header
     ↓
HTTP 200 OK with resource ← Resource Server
     ↓
Genesis Agent receives data
```

### 3.2 Component Architecture

**Core Components:**

1. **x402Client** (`infrastructure/x402_client.py`)
   - Manages crypto wallets (one per agent)
   - Signs EIP-712 payments
   - Handles payment retries
   - Tracks transaction history

2. **x402Middleware** (`infrastructure/x402_middleware.py`)
   - Intercepts HTTP 402 responses
   - Automatically generates payments
   - Retries requests with payment
   - Falls back to manual approval if budget exceeded

3. **x402WalletManager** (`infrastructure/x402_wallet_manager.py`)
   - Creates wallets for each agent
   - Funds wallets from treasury
   - Monitors wallet balances
   - Alerts when balance low (<$10)

4. **x402BudgetEnforcer** (`infrastructure/x402_budget_enforcer.py`)
   - Per-agent daily budgets ($1-100/day)
   - Cost alerts (>80% budget consumed)
   - Auto-refill from treasury
   - Emergency kill switch (halt all payments)

---

### 3.3 Integration with Existing Systems

**x402 + AP2 Coordination:**

```python
# In agent code
async def purchase_resource(url, amount_usd):
    # Small micropayments (<$10) → x402
    if amount_usd < 10.0:
        # Use x402 (autonomous, instant)
        payment = x402_client.create_payment(
            amount=amount_usd,
            token='USDC',
            chain='base'
        )
        response = requests.get(url, headers={'X-PAYMENT': payment.signature})
        return response

    # Large purchases (>$10) → AP2
    else:
        # Use AP2 (requires user approval)
        approval = await ap2_service.request_purchase(
            agent_name="research_agent",
            user_id=user_id,
            service_name="Premium Data API",
            price=amount_usd
        )
        if approval['approved']:
            response = requests.get(url)
            return response
        else:
            raise PaymentDenied("User did not approve purchase")
```

**Cost Tracking:**
```python
# BusinessMonitor tracks both AP2 and x402 costs
monitor.log_payment(
    agent_name="research_agent",
    payment_type="x402",
    amount_usd=0.10,
    transaction_hash="0xABCD...",
    resource="premium-data-api"
)

monitor.log_payment(
    agent_name="marketing_agent",
    payment_type="ap2",
    amount_usd=500.00,
    mandate_id="MANDATE_123",
    resource="google-ads-campaign"
)
```

---

## Part 4: Implementation Plan

### Phase 1: x402 Client Foundation (Week 1)

#### 1.1 Install x402 SDK

- [x] **Add x402 dependencies to requirements.txt**
  ```
  x402-python>=1.0.0
  web3>=6.0.0
  eth-account>=0.10.0
  ```

- [x] **Install:**
  ```bash
  pip install x402 web3 eth-account
  ```


- [x] **Verify installation:**
  ```python
  import importlib.metadata as _m
  print(_m.version('x402'))
  ```

---

#### 1.2 Create x402Client Wrapper

- [x] **Create `infrastructure/x402_client.py`**

```python
"""
x402 Payment Protocol Client for Genesis
Enables autonomous agent payments via HTTP 402
"""
import os
import logging
from typing import Dict, Optional
from dataclasses import dataclass
from web3 import Web3
from eth_account import Account
from x402 import X402Client as X402SDK

logger = logging.getLogger(__name__)


@dataclass
class X402Payment:
    """Represents a signed x402 payment"""
    signature: str
    amount: float
    token: str
    chain: str
    recipient: str
    transaction_hash: Optional[str] = None


class X402Client:
    """
    x402 payment client for Genesis agents

    Handles:
    - Wallet management per agent
    - Payment signing (EIP-712)
    - Transaction broadcasting
    - Payment verification
    """

    def __init__(self, agent_name: str, chain: str = "base"):
        self.agent_name = agent_name
        self.chain = chain

        # Initialize Web3 connection
        self.w3 = self._init_web3(chain)

        # Load or create agent wallet
        self.wallet = self._load_wallet(agent_name)

        # Initialize x402 SDK
        self.x402 = X402SDK(
            private_key=self.wallet['private_key'],
            chain=chain
        )

        logger.info(f"x402Client initialized for {agent_name} on {chain}")
        logger.info(f"Wallet address: {self.wallet['address']}")

    def _init_web3(self, chain: str) -> Web3:
        """Initialize Web3 connection for specified chain"""
        rpc_urls = {
            'base': os.getenv('BASE_RPC_URL', 'https://mainnet.base.org'),
            'ethereum': os.getenv('ETH_RPC_URL', 'https://eth.llamarpc.com'),
            'solana': os.getenv('SOLANA_RPC_URL', 'https://api.mainnet-beta.solana.com')
        }

        w3 = Web3(Web3.HTTPProvider(rpc_urls[chain]))

        if not w3.is_connected():
            raise ConnectionError(f"Failed to connect to {chain} RPC")

        return w3

    def _load_wallet(self, agent_name: str) -> Dict:
        """Load or create wallet for agent"""
        # Check if wallet exists in env
        private_key_env = f"X402_WALLET_{agent_name.upper()}_PRIVATE_KEY"
        private_key = os.getenv(private_key_env)

        if private_key:
            # Load existing wallet
            account = Account.from_key(private_key)
        else:
            # Create new wallet
            account = Account.create()
            logger.warning(
                f"Created new wallet for {agent_name}. "
                f"Add to .env: {private_key_env}={account.key.hex()}"
            )

        return {
            'address': account.address,
            'private_key': account.key.hex()
        }

    def create_payment(
        self,
        amount: float,
        token: str = "USDC",
        recipient: str = None,
        metadata: Dict = None
    ) -> X402Payment:
        """
        Create signed x402 payment

        Args:
            amount: Amount in USD (e.g., 0.10 = 10 cents)
            token: Token symbol (USDC, ETH, etc.)
            recipient: Recipient address (from X-PAYMENT-ADDRESS header)
            metadata: Optional payment metadata

        Returns:
            X402Payment with signature
        """
        try:
            # Sign payment using EIP-712
            signature = self.x402.sign_payment(
                amount=amount,
                token=token,
                recipient=recipient,
                chain=self.chain
            )

            payment = X402Payment(
                signature=signature,
                amount=amount,
                token=token,
                chain=self.chain,
                recipient=recipient
            )

            logger.info(
                f"Created x402 payment: {amount} {token} to {recipient[:10]}..."
            )

            return payment

        except Exception as e:
            logger.error(f"Failed to create x402 payment: {e}")
            raise

    def get_balance(self, token: str = "USDC") -> float:
        """Get wallet balance for specified token"""
        try:
            balance = self.x402.get_balance(token, self.chain)
            return balance
        except Exception as e:
            logger.error(f"Failed to get balance: {e}")
            return 0.0

    def needs_funding(self, min_balance: float = 10.0, token: str = "USDC") -> bool:
        """Check if wallet needs funding"""
        balance = self.get_balance(token)
        return balance < min_balance
```

**Testing:**
- [ ] Test wallet creation for new agent
- [ ] Test wallet loading for existing agent
- [ ] Test payment signing (EIP-712)
- [x] Test balance checking

---

#### 1.3 Create x402Middleware

- [x] **Create `infrastructure/x402_middleware.py`**

```python
"""
x402 HTTP Middleware for Genesis
Automatically handles HTTP 402 responses with payments
"""
import logging
import requests
from typing import Optional
from infrastructure.x402_client import X402Client, X402Payment

logger = logging.getLogger(__name__)


class X402Middleware:
    """
    HTTP middleware that intercepts 402 responses and pays automatically

    Usage:
        middleware = X402Middleware(agent_name="research_agent")
        response = middleware.get("https://paid-api.com/data")
    """

    def __init__(self, agent_name: str, chain: str = "base"):
        self.agent_name = agent_name
        self.x402_client = X402Client(agent_name, chain)

    def get(self, url: str, **kwargs) -> requests.Response:
        """GET request with automatic x402 payment handling"""
        return self._request_with_payment("GET", url, **kwargs)

    def post(self, url: str, **kwargs) -> requests.Response:
        """POST request with automatic x402 payment handling"""
        return self._request_with_payment("POST", url, **kwargs)

    def _request_with_payment(
        self,
        method: str,
        url: str,
        max_retries: int = 1,
        **kwargs
    ) -> requests.Response:
        """
        Make HTTP request with automatic payment on 402

        Args:
            method: HTTP method (GET, POST, etc.)
            url: Target URL
            max_retries: Max payment retries (default 1)
            **kwargs: Additional request parameters

        Returns:
            Response object (200 OK if payment succeeded)
        """
        # Initial request (no payment)
        response = requests.request(method, url, **kwargs)

        # If 402 Payment Required, pay and retry
        if response.status_code == 402 and max_retries > 0:
            logger.info(f"Received HTTP 402 from {url}")

            # Extract payment info from headers
            payment_amount = response.headers.get('X-PAYMENT-AMOUNT')
            payment_address = response.headers.get('X-PAYMENT-ADDRESS')
            payment_token = response.headers.get('X-PAYMENT-TOKEN', 'USDC')

            if not payment_amount or not payment_address:
                logger.error("Missing payment headers in 402 response")
                return response

            # Create payment
            try:
                payment = self.x402_client.create_payment(
                    amount=float(payment_amount),
                    token=payment_token,
                    recipient=payment_address
                )

                # Retry request with payment
                kwargs.setdefault('headers', {})
                kwargs['headers']['X-PAYMENT'] = payment.signature

                response = requests.request(method, url, **kwargs)

                if response.status_code == 200:
                    logger.info(f"x402 payment successful: {payment_amount} {payment_token}")

                    # Extract transaction hash from response
                    tx_hash = response.headers.get('X-TRANSACTION-HASH')
                    if tx_hash:
                        payment.transaction_hash = tx_hash
                else:
                    logger.error(f"Payment failed: HTTP {response.status_code}")

            except Exception as e:
                logger.error(f"x402 payment error: {e}")

        return response
```

**Testing:**
- [ ] Test GET request without 402 (normal flow)
- [ ] Test GET request with 402 (payment flow)
- [ ] Test POST request with 402
- [ ] Test payment retry on failure

---

### Phase 2: Wallet Management (Week 2)

#### 2.1 Create x402WalletManager

- [x] **Create `infrastructure/x402_wallet_manager.py`**

```python
"""
x402 Wallet Manager for Genesis
Manages wallets for all 21 agents
"""
import os
import logging
from typing import Dict, List
from infrastructure.x402_client import X402Client

logger = logging.getLogger(__name__)


class X402WalletManager:
    """
    Manages crypto wallets for all Genesis agents

    Responsibilities:
    - Create wallets for new agents
    - Fund wallets from treasury
    - Monitor balances
    - Alert on low balances
    """

    def __init__(self, treasury_address: str = None, chain: str = "base"):
        self.chain = chain
        self.treasury_address = treasury_address or os.getenv('X402_TREASURY_ADDRESS')
        self.agents = self._get_all_agents()
        self.wallets = {}

        # Initialize wallets for all agents
        for agent_name in self.agents:
            self.wallets[agent_name] = X402Client(agent_name, chain)

        logger.info(f"WalletManager initialized for {len(self.agents)} agents")

    def _get_all_agents(self) -> List[str]:
        """Get list of all Genesis agents"""
        return [
            "research_agent",
            "builder_agent",
            "qa_agent",
            "deploy_agent",
            "marketing_agent",
            "content_agent",
            "seo_agent",
            "email_agent",
            "analyst_agent",
            "billing_agent",
            "support_agent",
            "legal_agent",
            "security_agent",
            "maintenance_agent",
            "onboarding_agent",
            "spec_agent",
            "darwin_agent",
            "se_darwin_agent",
            "reflection_agent",
            "domain_name_agent",
            "pricing_agent"
        ]

    def get_all_balances(self, token: str = "USDC") -> Dict[str, float]:
        """Get balances for all agent wallets"""
        balances = {}
        for agent_name, wallet in self.wallets.items():
            balances[agent_name] = wallet.get_balance(token)
        return balances

    def get_low_balance_agents(
        self,
        min_balance: float = 10.0,
        token: str = "USDC"
    ) -> List[str]:
        """Get agents with low balances (<$10)"""
        balances = self.get_all_balances(token)
        return [
            agent for agent, balance in balances.items()
            if balance < min_balance
        ]

    def fund_agent_wallet(
        self,
        agent_name: str,
        amount: float,
        token: str = "USDC"
    ):
        """
        Fund agent wallet from treasury

        Args:
            agent_name: Agent to fund
            amount: Amount to send (e.g., 100.0 = $100 USDC)
            token: Token to send
        """
        wallet = self.wallets[agent_name]
        recipient_address = wallet.wallet['address']

        logger.info(
            f"Funding {agent_name} with {amount} {token} "
            f"to {recipient_address[:10]}..."
        )

        # TODO: Implement treasury → agent transfer
        # This requires treasury wallet integration
        # For now, log the funding request

        logger.warning(
            "Treasury funding not implemented yet. "
            "Manually send funds to wallet addresses."
        )

    def auto_refill_wallets(
        self,
        min_balance: float = 10.0,
        refill_amount: float = 100.0,
        token: str = "USDC"
    ):
        """
        Automatically refill wallets below min_balance

        Args:
            min_balance: Trigger refill if balance < this
            refill_amount: Amount to add per refill
            token: Token to refill
        """
        low_balance_agents = self.get_low_balance_agents(min_balance, token)

        if low_balance_agents:
            logger.warning(
                f"{len(low_balance_agents)} agents need funding: "
                f"{low_balance_agents}"
            )

            for agent_name in low_balance_agents:
                self.fund_agent_wallet(agent_name, refill_amount, token)
```

**Testing:**
- [x] Test wallet initialization for all 21 agents
- [x] Test balance checking
- [x] Test low balance detection
- [ ] Test funding request (manual for now)

---

#### 2.2 Create x402BudgetEnforcer

- [x] **Create `infrastructure/x402_budget_enforcer.py`**

```python
"""
x402 Budget Enforcer for Genesis
Enforces daily spending limits per agent
"""
import logging
from datetime import datetime, timedelta
from typing import Dict
from infrastructure.business_monitor import BusinessMonitor

logger = logging.getLogger(__name__)


class X402BudgetEnforcer:
    """
    Enforces daily spending budgets for x402 payments

    Daily Budgets (configurable):
    - Research Agent: $50/day (data APIs)
    - Builder Agent: $100/day (LLM APIs)
    - QA Agent: $20/day (compute)
    - Deploy Agent: $30/day (serverless)
    - SEO Agent: $10/day (SEO tools)
    - Content Agent: $20/day (stock media)
    - Others: $5/day (minimal usage)
    """

    DEFAULT_BUDGETS = {
        # High-volume agents ($50-100/day)
        "research_agent": 50.0,        # Premium data APIs
        "builder_agent": 100.0,        # LLM APIs, code generation
        "marketing_agent": 50.0,       # Ad platform APIs
        "genesis_meta_agent": 100.0,   # Orchestration compute, premium LLMs

        # Medium-volume agents ($20-50/day)
        "deploy_agent": 30.0,          # Serverless compute
        "analyst_agent": 30.0,         # Analytics platforms, data warehouses
        "commerce_agent": 40.0,        # Payment gateways, tax APIs, domains
        "finance_agent": 30.0,         # Payroll, invoicing, financial reports
        "pricing_agent": 25.0,         # Pricing intelligence, experiments
        "content_agent": 20.0,         # Stock media
        "qa_agent": 20.0,              # Cloud compute for testing

        # Low-volume agents ($5-15/day)
        "seo_agent": 10.0,             # SEO tools
        "support_agent": 15.0,         # Helpdesk, live chat, transcription
        "email_agent": 10.0,           # Email services, validation

        # All other agents: $5/day default
    }

    def __init__(self, monitor: BusinessMonitor = None):
        self.monitor = monitor or BusinessMonitor()
        self.daily_spend = {}  # {agent_name: {date: amount}}
        self.budgets = self.DEFAULT_BUDGETS.copy()

    def can_spend(
        self,
        agent_name: str,
        amount: float,
        date: str = None
    ) -> bool:
        """
        Check if agent can spend amount without exceeding budget

        Args:
            agent_name: Agent requesting spend
            amount: Amount to spend (USD)
            date: Date (default: today)

        Returns:
            True if spend allowed, False if budget exceeded
        """
        if not date:
            date = datetime.now().strftime("%Y-%m-%d")

        # Get daily budget for this agent
        budget = self.budgets.get(agent_name, 5.0)  # Default $5/day

        # Get current spend for today
        current_spend = self._get_daily_spend(agent_name, date)

        # Check if new spend would exceed budget
        would_exceed = (current_spend + amount) > budget

        if would_exceed:
            logger.warning(
                f"{agent_name} budget exceeded: "
                f"${current_spend:.2f} + ${amount:.2f} > ${budget:.2f}"
            )
            return False

        return True

    def record_spend(
        self,
        agent_name: str,
        amount: float,
        resource: str,
        transaction_hash: str = None,
        date: str = None
    ):
        """Record x402 spend for agent"""
        if not date:
            date = datetime.now().strftime("%Y-%m-%d")

        # Update daily spend tracking
        if agent_name not in self.daily_spend:
            self.daily_spend[agent_name] = {}

        self.daily_spend[agent_name][date] = (
            self.daily_spend[agent_name].get(date, 0.0) + amount
        )

        # Log to BusinessMonitor
        self.monitor.log_payment(
            agent_name=agent_name,
            payment_type="x402",
            amount_usd=amount,
            transaction_hash=transaction_hash,
            resource=resource
        )

        # Check if approaching budget limit (80%)
        budget = self.budgets.get(agent_name, 5.0)
        current_spend = self.daily_spend[agent_name][date]

        if current_spend >= budget * 0.8:
            logger.warning(
                f"{agent_name} at {current_spend/budget*100:.0f}% of daily budget: "
                f"${current_spend:.2f} / ${budget:.2f}"
            )

    def _get_daily_spend(self, agent_name: str, date: str) -> float:
        """Get total spend for agent on specific date"""
        return self.daily_spend.get(agent_name, {}).get(date, 0.0)

    def get_budget_status(self, agent_name: str) -> Dict:
        """Get budget status for agent (today)"""
        date = datetime.now().strftime("%Y-%m-%d")
        budget = self.budgets.get(agent_name, 5.0)
        spend = self._get_daily_spend(agent_name, date)

        return {
            "agent": agent_name,
            "date": date,
            "budget": budget,
            "spent": spend,
            "remaining": budget - spend,
            "percent_used": (spend / budget * 100) if budget > 0 else 0
        }
```

**Testing:**
- [ ] Test budget enforcement (allow spend if under budget)
- [x] Test budget exceeded (deny spend if over budget)
- [x] Test spend recording
- [x] Test budget status reporting
- [x] Test 80% warning threshold

---

### Phase 3: Agent Integration (Weeks 3-5)

#### 3.1 Research Agent Integration

- [ ] **Modify `agents/research_discovery_agent.py`**

```python
from infrastructure.x402_middleware import X402Middleware
from infrastructure.x402_budget_enforcer import X402BudgetEnforcer

class ResearchDiscoveryAgent:
    def __init__(self):
        # Initialize x402 middleware
        self.x402 = X402Middleware(agent_name="research_agent")
        self.budget = X402BudgetEnforcer()

    async def fetch_premium_data(self, query: str, max_cost: float = 1.0):
        """Fetch data from premium APIs using x402"""
        # Check budget before making request
        if not self.budget.can_spend("research_agent", max_cost):
            raise BudgetExceeded(
                f"Cannot spend ${max_cost:.2f} - daily budget exceeded"
            )

        # Make request (x402 middleware handles payment automatically)
        response = self.x402.get(
            f"https://premium-data-api.com/search?q={query}"
        )

        # Record spend if payment was made
        if response.status_code == 200:
            payment_amount = response.headers.get('X-PAYMENT-RESPONSE-AMOUNT', 0)
            if payment_amount:
                self.budget.record_spend(
                    agent_name="research_agent",
                    amount=float(payment_amount),
                    resource="premium-data-api",
                    transaction_hash=response.headers.get('X-TRANSACTION-HASH')
                )

        return response.json()
```

**Testing:**
- [ ] Test premium data fetch with x402
- [ ] Test budget enforcement
- [ ] Test payment recording

---

#### 3.2 Builder Agent Integration

- [ ] **Modify `agents/builder_agent.py`**

```python
from infrastructure.x402_middleware import X402Middleware

class BuilderAgent:
    def __init__(self):
        self.x402 = X402Middleware(agent_name="builder_agent")

    async def generate_code_with_premium_llm(self, prompt: str):
        """Use premium LLM via x402 for complex code generation"""
        response = self.x402.post(
            "https://api.premium-llm.com/v1/completions",
            json={
                "model": "gpt-4.5-turbo",
                "prompt": prompt,
                "max_tokens": 2000
            }
        )

        return response.json()
```

**Testing:**
- [ ] Test LLM API call with x402
- [ ] Test payment for tokens used

---

#### 3.3 QA Agent Integration

- [ ] **Modify `agents/qa_agent.py`**

```python
from infrastructure.x402_middleware import X402Middleware

class QAAgent:
    def __init__(self):
        self.x402 = X402Middleware(agent_name="qa_agent")

    async def run_tests_on_cloud_compute(self, test_suite: str):
        """Rent cloud GPU for visual regression testing"""
        response = self.x402.post(
            "https://compute.x402.cloud/run-test",
            json={
                "test_suite": test_suite,
                "duration_seconds": 300,
                "gpu_type": "A100"
            }
        )

        return response.json()
```

**Testing:**
- [ ] Test cloud compute rental with x402
- [ ] Test payment per second of compute

---

#### 3.4 Deploy Agent Integration

- [ ] **Modify `agents/deploy_agent.py`**

```python
from infrastructure.x402_middleware import X402Middleware

class DeployAgent:
    def __init__(self):
        self.x402 = X402Middleware(agent_name="deploy_agent")

    async def deploy_serverless(self, function_code: str):
        """Deploy serverless function with x402 payment"""
        response = self.x402.post(
            "https://serverless.x402.cloud/deploy",
            json={
                "function_code": function_code,
                "runtime": "nodejs18",
                "memory_mb": 512
            }
        )

        return response.json()
```

**Testing:**
- [ ] Test serverless deployment with x402
- [ ] Test payment per invocation

---

#### 3.5 SEO Agent Integration

- [ ] **Modify `agents/seo_agent.py`**

```python
from infrastructure.x402_middleware import X402Middleware

class SEOAgent:
    def __init__(self):
        self.x402 = X402Middleware(agent_name="seo_agent")

    async def analyze_backlinks(self, domain: str):
        """Analyze backlinks using premium SEO tool"""
        response = self.x402.get(
            f"https://api.ahrefs-x402.com/backlinks?domain={domain}"
        )

        return response.json()
```

**Testing:**
- [ ] Test SEO tool API with x402
- [ ] Test payment per analysis

---

#### 3.6 Content Agent Integration

- [ ] **Modify `agents/content_agent.py`**

```python
from infrastructure.x402_middleware import X402Middleware

class ContentAgent:
    def __init__(self):
        self.x402 = X402Middleware(agent_name="content_agent")

    async def purchase_stock_image(self, image_id: str):
        """Purchase premium stock image"""
        response = self.x402.get(
            f"https://stock.x402.media/download/{image_id}?resolution=4K"
        )

        return response.content  # Image bytes
```

**Testing:**
- [ ] Test stock image purchase with x402
- [ ] Test payment per asset

---

#### 3.7 Marketing Agent Integration

- [ ] **Modify `agents/marketing_agent.py`**

```python
from infrastructure.x402_middleware import X402Middleware

class MarketingAgent:
    def __init__(self):
        self.x402 = X402Middleware(agent_name="marketing_agent")

    async def run_ad_campaign(self, campaign_config: dict):
        """Run ad campaign via x402 platform"""
        response = self.x402.post(
            "https://ads-platform.x402.com/campaigns/create",
            json=campaign_config
        )

        return response.json()
```

**Testing:**
- [ ] Test ad campaign creation with x402
- [ ] Test payment per ad spend

---

#### 3.8 Commerce Agent Integration

- [x] **Modify `agents/commerce_agent.py`**

```python
from infrastructure.x402_middleware import X402Middleware

class CommerceAgent:
    def __init__(self):
        self.x402 = X402Middleware(agent_name="commerce_agent")

    async def register_domain(self, domain: str):
        """Register domain via x402"""
        response = self.x402.post(
            "https://domain-api.x402.com/register",
            json={"domain": domain, "years": 1}
        )

        return response.json()

    async def setup_payment_gateway(self, gateway: str):
        """Setup payment gateway via x402"""
        response = self.x402.post(
            "https://payment-gateway.x402.com/setup",
            json={"gateway": gateway, "features": ["fraud_detection"]}
        )

        return response.json()
```

**Testing:**
- [x] Test domain registration with x402
- [x] Test payment gateway setup with x402

---

#### 3.9 Finance Agent Integration

- [x] **Modify `agents/finance_agent.py`**

```python
from infrastructure.x402_middleware import X402Middleware

class FinanceAgent:
    def __init__(self):
        self.x402 = X402Middleware(agent_name="finance_agent")

    async def process_payroll(self, employees: list):
        """Process payroll via x402"""
        response = self.x402.post(
            "https://payroll-api.x402.com/process",
            json={"employees": employees, "period": "2025-01-15"}
        )

        return response.json()

    async def generate_financial_report(self, report_type: str):
        """Generate financial report via x402"""
        response = self.x402.get(
            f"https://finance-reports.x402.com/generate?type={report_type}"
        )

        return response.json()
```

**Testing:**
- [x] Test payroll processing with x402
- [x] Test financial report generation with x402

---

#### 3.10 Pricing Agent Integration

- [x] **Modify `agents/pricing_agent.py`**

```python
from infrastructure.x402_middleware import X402Middleware

class PricingAgent:
    def __init__(self):
        self.x402 = X402Middleware(agent_name="pricing_agent")

    async def get_competitive_pricing(self, product: str):
        """Get competitive pricing analysis via x402"""
        response = self.x402.get(
            f"https://pricing-intelligence.x402.com/competitive-analysis?product={product}"
        )

        return response.json()

    async def run_pricing_experiment(self, experiment_config: dict):
        """Run pricing experiment via x402"""
        response = self.x402.post(
            "https://pricing-experiments.x402.com/run",
            json=experiment_config
        )

        return response.json()
```

**Testing:**
- [x] Test pricing analysis with x402
- [x] Test pricing experiments with x402

---

#### 3.11 Support Agent Integration

- [x] **Modify `agents/support_agent.py`**

```python
from infrastructure.x402_middleware import X402Middleware

class SupportAgent:
    def __init__(self):
        self.x402 = X402Middleware(agent_name="support_agent")

    async def create_helpdesk_ticket(self, ticket_data: dict):
        """Create helpdesk ticket via x402"""
        response = self.x402.post(
            "https://helpdesk.x402.com/create-ticket",
            json=ticket_data
        )

        return response.json()

    async def transcribe_voice_call(self, audio_url: str):
        """Transcribe voice call via x402"""
        response = self.x402.post(
            "https://voice-support.x402.com/transcribe",
            json={"audio_url": audio_url, "language": "en"}
        )

        return response.json()
```

**Testing:**
- [x] Test helpdesk ticket creation with x402
- [x] Test voice transcription with x402

---

#### 3.12 Email Agent Integration

- [x] **Modify `agents/email_agent.py`**

```python
from infrastructure.x402_middleware import X402Middleware

class EmailAgent:
    def __init__(self):
        self.x402 = X402Middleware(agent_name="email_agent")

    async def send_transactional_email(self, email_data: dict):
        """Send transactional email via x402"""
        response = self.x402.post(
            "https://email-api.x402.com/send",
            json=email_data
        )

        return response.json()

    async def validate_email(self, email: str):
        """Validate email deliverability via x402"""
        response = self.x402.post(
            "https://email-validation.x402.com/verify",
            json={"email": email, "check_smtp": True}
        )

        return response.json()
```

**Testing:**
- [x] Test email sending with x402
- [x] Test email validation with x402

---

#### 3.13 Analyst Agent Integration

- [x] **Modify `agents/analyst_agent.py`**

```python
from infrastructure.x402_middleware import X402Middleware

class AnalystAgent:
    def __init__(self):
        self.x402 = X402Middleware(agent_name="analyst_agent")

    async def run_funnel_analysis(self, funnel_config: dict):
        """Run funnel analysis via x402"""
        response = self.x402.post(
            "https://analytics-pro.x402.com/funnel-analysis",
            json=funnel_config
        )

        return response.json()

    async def query_data_warehouse(self, sql: str):
        """Query data warehouse via x402"""
        response = self.x402.post(
            "https://data-warehouse.x402.com/query",
            json={"sql": sql, "warehouse": "snowflake"}
        )

        return response.json()
```

**Testing:**
- [x] Test funnel analysis with x402
- [x] Test data warehouse queries with x402

---

#### 3.14 Genesis Meta Agent Integration

- [x] **Modify `agents/genesis_meta_agent.py`**

```python
from infrastructure.x402_middleware import X402Middleware

class GenesisMetaAgent:
    def __init__(self):
        self.x402 = X402Middleware(agent_name="genesis_meta_agent")

    async def call_premium_llm(self, messages: list):
        """Call premium LLM for orchestration via x402"""
        response = self.x402.post(
            "https://llm-api.x402.com/completions",
            json={"model": "gpt-4.5-turbo", "messages": messages}
        )

        return response.json()

    async def optimize_prompt(self, prompt: str):
        """Optimize prompt via x402"""
        response = self.x402.post(
            "https://prompt-optimizer.x402.com/optimize",
            json={"base_prompt": prompt, "optimization_goal": "reduce_tokens"}
        )

        return response.json()
```

**Testing:**
- [x] Test premium LLM calls with x402
- [x] Test prompt optimization with x402

---

### Phase 4: Dashboard & Monitoring (Week 5)

#### 4.1 Add x402 Metrics to BusinessMonitor

- [x] **Modify `infrastructure/business_monitor.py`**

```python
class BusinessMonitor:
    def __init__(self):
        # Existing initialization
        self.x402_payments = []  # NEW: Track x402 payments

    def log_payment(
        self,
        agent_name: str,
        payment_type: str,  # "ap2" or "x402"
        amount_usd: float,
        transaction_hash: str = None,
        mandate_id: str = None,
        resource: str = None
    ):
        """Log payment (AP2 or x402)"""
        payment = {
            "timestamp": datetime.now().isoformat(),
            "agent": agent_name,
            "type": payment_type,
            "amount": amount_usd,
            "transaction_hash": transaction_hash,
            "mandate_id": mandate_id,
            "resource": resource
        }

        if payment_type == "x402":
            self.x402_payments.append(payment)

        # Also log to general payment log
        # ...

    def get_x402_metrics(self) -> Dict:
        """Get x402 payment metrics"""
        total_payments = len(self.x402_payments)
        total_amount = sum(p['amount'] for p in self.x402_payments)

        # Per-agent breakdown
        agent_totals = {}
        for payment in self.x402_payments:
            agent = payment['agent']
            agent_totals[agent] = agent_totals.get(agent, 0.0) + payment['amount']

        return {
            "total_payments": total_payments,
            "total_amount_usd": total_amount,
            "average_payment": total_amount / total_payments if total_payments > 0 else 0,
            "agent_breakdown": agent_totals
        }
```

---

#### 4.2 Add x402 Dashboard Endpoint

- [x] **Modify `scripts/dashboard_api_server.py`**

```python
@app.get("/api/x402/metrics")
async def get_x402_metrics():
    """Get x402 payment metrics"""
    monitor = BusinessMonitor()
    return monitor.get_x402_metrics()

@app.get("/api/x402/wallets")
async def get_wallet_balances():
    """Get wallet balances for all agents"""
    from infrastructure.x402_wallet_manager import X402WalletManager
    manager = X402WalletManager()
    balances = manager.get_all_balances()
    return {"wallets": balances}
```

---

#### 4.3 Add x402 Dashboard UI

- [x] **Create `genesis-dashboard/src/app/x402/page.tsx`**

```typescript
export default function X402Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [wallets, setWallets] = useState(null);

  useEffect(() => {
    // Fetch x402 metrics
    fetch('http://localhost:5001/api/x402/metrics')
      .then(res => res.json())
      .then(setMetrics);

    // Fetch wallet balances
    fetch('http://localhost:5001/api/x402/wallets')
      .then(res => res.json())
      .then(setWallets);
  }, []);

  return (
    <div>
      <h1>x402 Payment Dashboard</h1>

      <div>
        <h2>Total Payments</h2>
        <p>{metrics?.total_payments || 0}</p>
        <p>${metrics?.total_amount_usd?.toFixed(2) || '0.00'}</p>
      </div>

      <div>
        <h2>Wallet Balances</h2>
        {wallets && Object.entries(wallets.wallets).map(([agent, balance]) => (
          <div key={agent}>
            <span>{agent}:</span>
            <span>${balance} USDC</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### Phase 5: Discord Integration (Week 6)

#### 5.1 Add x402 Notifications to Discord

- [ ] **Modify `infrastructure/genesis_discord.py`**

```python
class GenesisDiscord:
    async def x402_payment_made(
        self,
        agent_name: str,
        amount: float,
        resource: str,
        transaction_hash: str
    ):
        """Notify x402 payment made"""
        embed = {
            'title': f'💳 x402 Payment: {agent_name}',
            'description': f'**Amount:** ${amount:.4f} USDC\n**Resource:** {resource}\n**TX:** {transaction_hash[:16]}...',
            'color': 0x3498db,  # Blue
            'timestamp': datetime.now().isoformat()
        }
        await self._send_webhook(self.webhook_metrics, embed)

    async def x402_budget_warning(self, agent_name: str, percent_used: float):
        """Alert when agent uses 80% of daily budget"""
        embed = {
            'title': f'⚠️ x402 Budget Warning: {agent_name}',
            'description': f'**Budget Used:** {percent_used:.0f}%',
            'color': 0xf39c12,  # Orange
            'timestamp': datetime.now().isoformat()
        }
        await self._send_webhook(self.webhook_alerts, embed)

    async def x402_wallet_low_balance(self, agent_name: str, balance: float):
        """Alert when wallet balance <$10"""
        embed = {
            'title': f'🪙 Low Wallet Balance: {agent_name}',
            'description': f'**Balance:** ${balance:.2f} USDC\n**Action:** Needs refill',
            'color': 0xe74c3c,  # Red
            'timestamp': datetime.now().isoformat()
        }
        await self._send_webhook(self.webhook_alerts, embed)
```

---

## Part 5: Cost Analysis

### 5.1 x402 Transaction Costs

**Base Chain (Recommended):**
- Gas fees: ~$0.001-0.01 per transaction
- USDC transfer: ~$0.01
- Total cost per x402 payment: ~$0.02

**Payment Breakdown Example:**
```
Purchase premium data API call: $0.10
+ Base network fee: $0.02
= Total cost: $0.12

Traditional API subscription: $99/month ÷ 1000 calls = $0.099/call
x402 pay-per-call: $0.12/call

Savings if <800 calls/month: x402 cheaper
Break-even: 800 calls/month
```

### 5.2 Monthly Cost Projections

**Scenario: 100 Businesses/Month (All 13 Agents)**

| Agent | Calls/Business | Cost/Call | Total/Month |
|-------|----------------|-----------|-------------|
| Research | 50 | $0.10 | $500 |
| Builder | 20 | $0.50 | $1,000 |
| QA | 10 | $1.00 | $1,000 |
| Deploy | 5 | $0.20 | $100 |
| SEO | 10 | $0.15 | $150 |
| Content | 20 | $0.25 | $500 |
| Marketing | 15 | $0.30 | $450 |
| Commerce | 8 | $0.50 | $400 |
| Finance | 10 | $0.40 | $400 |
| Pricing | 12 | $0.20 | $240 |
| Support | 25 | $0.10 | $250 |
| Email | 100 | $0.001 | $10 |
| Analyst | 15 | $0.50 | $750 |
| Genesis Meta | 30 | $0.30 | $900 |
| **TOTAL** | **330** | - | **$6,650** |

**Add gas fees (+20%):** $7,980/month

**Compare to Subscriptions (All Services):**
- Ahrefs (SEO): $99/month
- SEMrush (SEO): $99/month
- Premium data APIs: $500/month
- Cloud compute: $200/month
- Stock media: $249/month
- Helpdesk (Zendesk): $49/month
- Email (SendGrid): $100/month
- Analytics (Mixpanel): $299/month
- Payment gateway setup: $49/month
- Payroll (Gusto): $149/month
- Pricing intelligence: $299/month
- Data warehouse (Snowflake): $500/month
- LLM APIs (OpenAI): $500/month
- Total subscriptions: ~$3,091/month

**Verdict:** x402 is MORE expensive at scale (100 businesses/month) = $7,980 vs $3,091 subscriptions

**Cost Breakdown:**
- x402 advantage: Pay-per-use, agent autonomy, no human approval needed
- Subscription advantage: Lower cost at high volume
- Break-even point: ~40-50 businesses/month

**Optimization Strategy:**
1. **<40 businesses/month:** Use x402 (lower cost, no subscriptions)
2. **40-100 businesses/month:** Hybrid approach (subscriptions for high-volume agents, x402 for sporadic needs)
3. **>100 businesses/month:** Subscriptions for most services, x402 for specialized/one-off needs

**Hybrid Approach Example (100 businesses/month):**
- Subscriptions: $3,091/month (high-volume services)
- x402: $1,500/month (sporadic/specialized needs)
- Total: $4,591/month (42% savings vs pure x402)

---

## Part 6: Security & Risk Management

### 6.1 Wallet Security

**Risks:**
- Private keys leaked → funds stolen
- Wallet hacked → unauthorized payments
- Agent compromised → budget drained

**Mitigations:**
- [ ] Store private keys in encrypted vault (AWS Secrets Manager, Vault)
- [ ] Use hardware wallets for treasury
- [ ] Implement multi-sig for treasury → agent transfers
- [ ] Daily spending limits per agent ($5-100/day)
- [ ] Alert on unusual spending patterns
- [ ] Emergency kill switch (halt all x402 payments)

---

### 6.2 Budget Controls

**Tiered Budget System:**

**Tier 1: Micro ($0-10/day)**
- Approval: Fully autonomous
- Agents: Support, Legal, Maintenance
- Use cases: Occasional API calls

**Tier 2: Small ($10-50/day)**
- Approval: Autonomous with alerts at 80%
- Agents: SEO, Content, Email, Analyst
- Use cases: Regular tool usage

**Tier 3: Medium ($50-100/day)**
- Approval: Autonomous with daily reports
- Agents: Research, Marketing, Deploy
- Use cases: High-volume API usage

**Tier 4: Large ($100+/day)**
- Approval: Requires AP2 approval above threshold
- Agents: Builder (LLM), Genesis Meta (orchestrator)
- Use cases: Expensive compute, premium LLMs

---

### 6.3 Fraud Detection

- [ ] **Anomaly Detection**
  - Alert if agent spends >3x average in 1 hour
  - Alert if new resource never used before
  - Alert if payment to unknown address

- [ ] **Transaction Validation**
  - Verify payment matches expected amount
  - Verify recipient address matches X-PAYMENT-ADDRESS header
  - Verify chain matches expected (Base, not random chain)

- [ ] **Kill Switch**
  - Manual: User can disable all x402 payments instantly
  - Automatic: Disable if fraud detected (>$1,000 in 1 hour)

---

## Part 7: Testing Strategy

### 7.1 Unit Tests

- [ ] **x402Client Tests** (`tests/test_x402_client.py`)
  - Test wallet creation
  - Test payment signing (EIP-712)
  - Test balance checking
  - Test payment verification

- [ ] **x402Middleware Tests** (`tests/test_x402_middleware.py`)
  - Test GET request without 402
  - Test GET request with 402 (auto-payment)
  - Test POST request with 402
  - Test payment retry on failure

- [ ] **x402BudgetEnforcer Tests** (`tests/test_x402_budget_enforcer.py`)
  - Test budget allow (under limit)
  - Test budget deny (over limit)
  - Test spend recording
  - Test 80% warning

---

### 7.2 Integration Tests

- [ ] **End-to-End Payment Flow**
  ```python
  # Test: Research Agent pays for premium data
  async def test_e2e_x402_payment():
      agent = ResearchDiscoveryAgent()

      # Make request requiring payment
      data = await agent.fetch_premium_data("test query")

      # Verify data received
      assert data is not None

      # Verify payment recorded
      budget = X402BudgetEnforcer()
      status = budget.get_budget_status("research_agent")
      assert status['spent'] > 0
  ```

- [ ] **Budget Enforcement Test**
  ```python
  async def test_budget_enforcement():
      agent = ResearchDiscoveryAgent()

      # Exhaust budget
      for i in range(50):  # 50 * $1 = $50 (budget limit)
          await agent.fetch_premium_data("query", max_cost=1.0)

      # Next request should fail (budget exceeded)
      with pytest.raises(BudgetExceeded):
          await agent.fetch_premium_data("query", max_cost=1.0)
  ```

---

### 7.3 Production Testing

- [ ] **Testnet Phase (Week 7)**
  - Deploy to Base Sepolia testnet
  - Use test USDC (faucet)
  - Run 100 test payments
  - Verify 0 failures

- [ ] **Mainnet Pilot (Week 8)**
  - Fund 3 agents with $10 each
  - Run 10 businesses
  - Monitor for issues
  - Verify costs match projections

- [ ] **Full Rollout (Week 9)**
  - Fund all 21 agents
  - Enable for production
  - Monitor for 1 week
  - Optimize based on usage

---

## Part 8: Timeline & Milestones

### 2-Day Aggressive Implementation Schedule

## DAY 1: Core Infrastructure + Agent Integration (16 hours)

### Hour 1-2: Foundation Setup
| Task | Status |
|------|--------|
| Install x402 SDK (`pip install x402-python web3 eth-account`) | ☐ |
| Create x402Client wrapper (infrastructure/x402_client.py) | ☐ |
| Create x402Middleware (infrastructure/x402_middleware.py) | ☐ |
| Create x402WalletManager (infrastructure/x402_wallet_manager.py) | ☐ |
| Create x402BudgetEnforcer (infrastructure/x402_budget_enforcer.py) | ☐ |
| Test basic wallet creation and payment signing | ☐ |

### Hour 3-4: Wallet Setup
| Task | Status |
|------|--------|
| Generate wallets for all 13 agents (automated script) | ☐ |
| Fund treasury wallet with $500 USDC (testnet) | ☐ |
| Distribute $10 to each agent wallet | ☐ |
| Test wallet creation and balance checking | ☐ |
| Save private keys to .env (encrypted) | ☐ |
| Verify all 13 wallets have correct balances | ☐ |

### Hour 5-8: Batch 1 Agent Integration (4 agents)

#### Hour 5: Research Agent
| Task | Status |
|------|--------|
| Add x402Middleware import to research_discovery_agent.py | ☐ |
| Add x402BudgetEnforcer initialization | ☐ |
| Implement fetch_premium_data() method with x402 | ☐ |
| Add budget checking before payments | ☐ |
| Add spend recording after successful payments | ☐ |
| Test with mock 402 response | ☐ |

#### Hour 6: Builder Agent
| Task | Status |
|------|--------|
| Add x402Middleware import to builder_agent.py | ☐ |
| Initialize x402 middleware in __init__() | ☐ |
| Implement generate_code_with_premium_llm() method | ☐ |
| Add payment handling for LLM API calls | ☐ |
| Test with mock premium LLM endpoint | ☐ |

#### Hour 7: QA Agent
| Task | Status |
|------|--------|
| Add x402Middleware import to qa_agent.py | ☐ |
| Initialize x402 middleware in __init__() | ☐ |
| Implement run_tests_on_cloud_compute() method | ☐ |
| Add payment handling for cloud compute | ☐ |
| Test with mock compute endpoint | ☐ |

#### Hour 8: Deploy Agent
| Task | Status |
|------|--------|
| Add x402Middleware import to deploy_agent.py | ☐ |
| Initialize x402 middleware in __init__() | ☐ |
| Implement deploy_serverless() method with x402 | ☐ |
| Add payment handling for serverless deployments | ☐ |
| Test with mock serverless endpoint | ☐ |

### Hour 9-12: Batch 2 Agent Integration (4 agents)

#### Hour 9: SEO Agent
| Task | Status |
|------|--------|
| Add x402Middleware import to seo_agent.py | ☐ |
| Initialize x402 middleware in __init__() | ☐ |
| Implement analyze_backlinks() method with x402 | ☐ |
| Add payment handling for SEO tools | ☐ |
| Test with mock SEO API endpoint | ☐ |

#### Hour 10: Content Agent
| Task | Status |
|------|--------|
| Add x402Middleware import to content_agent.py | ☐ |
| Initialize x402 middleware in __init__() | ☐ |
| Implement purchase_stock_image() method with x402 | ☐ |
| Add payment handling for stock media | ☐ |
| Test with mock stock media endpoint | ☐ |

#### Hour 11: Marketing Agent
| Task | Status |
|------|--------|
| Add x402Middleware import to marketing_agent.py | ☐ |
| Initialize x402 middleware in __init__() | ☐ |
| Implement run_ad_campaign() method with x402 | ☐ |
| Add payment handling for ad platforms | ☐ |
| Test with mock ad platform endpoint | ☐ |

#### Hour 12: Commerce Agent
| Task | Status |
|------|--------|
| Add x402Middleware import to commerce_agent.py | ☐ |
| Initialize x402 middleware in __init__() | ☐ |
| Implement register_domain() method with x402 | ☐ |
| Implement setup_payment_gateway() method with x402 | ☐ |
| Add payment handling for commerce APIs | ☐ |
| Test with mock commerce endpoints | ☐ |

### Hour 13-16: Batch 3 Agent Integration (5 agents)

#### Hour 13: Finance Agent + Pricing Agent
| Task | Status |
|------|--------|
| **Finance Agent:** Add x402Middleware import | ☐ |
| **Finance Agent:** Implement process_payroll() method | ☐ |
| **Finance Agent:** Implement generate_financial_report() method | ☐ |
| **Finance Agent:** Test with mock finance endpoints | ☐ |
| **Pricing Agent:** Add x402Middleware import | ☐ |
| **Pricing Agent:** Implement get_competitive_pricing() method | ☐ |
| **Pricing Agent:** Implement run_pricing_experiment() method | ☐ |
| **Pricing Agent:** Test with mock pricing endpoints | ☐ |

#### Hour 14: Support Agent + Email Agent
| Task | Status |
|------|--------|
| **Support Agent:** Add x402Middleware import | ☐ |
| **Support Agent:** Implement create_helpdesk_ticket() method | ☐ |
| **Support Agent:** Implement transcribe_voice_call() method | ☐ |
| **Support Agent:** Test with mock support endpoints | ☐ |
| **Email Agent:** Add x402Middleware import | ☐ |
| **Email Agent:** Implement send_transactional_email() method | ☐ |
| **Email Agent:** Implement validate_email() method | ☐ |
| **Email Agent:** Test with mock email endpoints | ☐ |

#### Hour 15: Analyst Agent + Genesis Meta Agent
| Task | Status |
|------|--------|
| **Analyst Agent:** Add x402Middleware import | ☐ |
| **Analyst Agent:** Implement run_funnel_analysis() method | ☐ |
| **Analyst Agent:** Implement query_data_warehouse() method | ☐ |
| **Analyst Agent:** Test with mock analytics endpoints | ☐ |
| **Genesis Meta Agent:** Add x402Middleware import | ☐ |
| **Genesis Meta Agent:** Implement call_premium_llm() method | ☐ |
| **Genesis Meta Agent:** Implement optimize_prompt() method | ☐ |
| **Genesis Meta Agent:** Test with mock LLM endpoints | ☐ |

#### Hour 16: End-to-End Testing
| Task | Status |
|------|--------|
| Test Research Agent with real 402 mock server | ☐ |
| Test Builder Agent with real 402 mock server | ☐ |
| Test QA Agent with real 402 mock server | ☐ |
| Test Deploy Agent with real 402 mock server | ☐ |
| Test SEO Agent with real 402 mock server | ☐ |
| Test Content Agent with real 402 mock server | ☐ |
| Test Marketing Agent with real 402 mock server | ☐ |
| Test Commerce Agent with real 402 mock server | ☐ |
| Test Finance Agent with real 402 mock server | ☐ |
| Test Pricing Agent with real 402 mock server | ☐ |
| Test Support Agent with real 402 mock server | ☐ |
| Test Email Agent with real 402 mock server | ☐ |
| Test Analyst Agent with real 402 mock server | ☐ |
| Test Genesis Meta Agent with real 402 mock server | ☐ |
| Verify budget enforcement works across all agents | ☐ |
| Verify payment recording to BusinessMonitor | ☐ |

**End of Day 1 Deliverables:**
| Deliverable | Status |
|-------------|--------|
| All infrastructure code complete (4 files) | ☐ |
| All 13 agents integrated with x402 | ☐ |
| Wallets funded and operational (13 wallets + 1 treasury) | ☐ |
| Basic testing passed (all agents) | ☐ |
| No blocking bugs remaining | ☐ |

---

## DAY 2: Dashboard, Monitoring & Production Testing (16 hours)

### Hour 1-2: Dashboard Integration
| Task | Status |
|------|--------|
| Add x402_payments list to BusinessMonitor class | ☑ |
| Add log_payment() method supporting x402 payment type | ☑ |
| Add get_x402_metrics() method returning payment stats | ☑ |
| Add `/api/x402/metrics` endpoint to dashboard_api_server.py | ☑ |
| Add `/api/x402/wallets` endpoint for wallet balances | ☑ |
| Create genesis-dashboard/src/app/x402/page.tsx component | ☑ |
| Add x402 navigation item to Sidebar.tsx | ☑ |
| Test real-time metrics display in browser | ☑ |
| Verify metrics update every 5 seconds | ☑ |

### Hour 3-4: Discord Integration
| Task | Status |
|------|--------|
| Add x402_payment_made() method to GenesisDiscord class | ☑ |
| Add x402_budget_warning() method (triggers at 80% budget) | ☑ |
| Add x402_wallet_low_balance() method (triggers at <$10) | ☑ |
| Create webhook URL for #x402-payments channel | ☑ |
| Add DISCORD_WEBHOOK_X402 to .env file | ☑ |
| Test payment notification with mock payment | ☐ |
| Test budget warning notification | ☐ |
| Test low balance alert notification | ☐ |
| Verify rich embeds display correctly in Discord | ☐ |

### Hour 5-8: Testnet Production Testing
| Task | Status |
|------|--------|
| Switch RPC URLs to Base Sepolia testnet | ☐ |
| Get testnet USDC from Base Sepolia faucet | ☐ |
| Fund treasury wallet with $500 testnet USDC | ☐ |
| Distribute $10 testnet USDC to each agent wallet | ☐ |
| Create mock x402 server (responds with 402, accepts payments) | ☐ |
| Run 5 test payments per agent (65 total payments) | ☐ |
| Verify payment success rate >95% | ☐ |
| Monitor for 402 response handling errors | ☐ |
| Monitor for payment signature errors | ☐ |
| Monitor for budget enforcement failures | ☐ |
| Check transaction hashes on Base Sepolia explorer | ☐ |
| Verify Discord notifications triggered correctly | ☐ |
| Fix any blocking issues immediately | ☐ |
| Document any edge cases discovered | ☐ |

### Hour 9-12: Mainnet Deployment
| Task | Status |
|------|--------|
| Switch RPC URLs to Base mainnet | ☐ |
| Purchase $200 USDC (Coinbase/Kraken) | ☐ |
| Send USDC to treasury wallet address | ☐ |
| Verify treasury balance on Base explorer | ☐ |
| Distribute $10 USDC to each of 13 agent wallets | ☐ |
| Verify all agent wallets funded correctly | ☐ |
| Run 1 test business with Research Agent only | ☐ |
| Verify first real payment succeeds | ☐ |
| Run 3 more businesses (various agents) | ☐ |
| Run 6 full businesses (all 13 agents active) | ☐ |
| Monitor transaction costs (should be <$0.05/tx) | ☐ |
| Monitor payment success rate (target >99%) | ☐ |
| Check all transactions on Base explorer | ☐ |
| Verify total spend matches expectations | ☐ |
| Verify Discord notifications for all payments | ☐ |
| Verify dashboard shows correct metrics | ☐ |

### Hour 13-14: Optimization & Bug Fixes
| Task | Status |
|------|--------|
| Analyze failed transactions (if any) | ☐ |
| Fix critical bugs blocking payments | ☐ |
| Optimize gas limit if transactions failing | ☐ |
| Check if gas fees >$0.05/transaction | ☐ |
| Implement gas fee optimization if needed | ☐ |
| Review budget thresholds vs actual usage | ☐ |
| Adjust budget limits if needed (too low/high) | ☐ |
| Add basic fraud detection (>$1K in 1 hour = alert) | ☐ |
| Add anomaly detection (>3x average spend = alert) | ☐ |
| Test fraud detection with mock high-spend scenario | ☐ |

### Hour 15-16: Documentation & Handoff
| Task | Status |
|------|--------|
| Document all 13 agent wallet addresses | ☐ |
| Save all private keys to encrypted vault (not .env) | ☐ |
| Document treasury wallet address and backup | ☐ |
| Create operational runbook (monitoring.md) | ☐ |
| Add wallet refill procedures to runbook | ☐ |
| Add troubleshooting section for common issues | ☐ |
| Set up auto-refill alert (balance <$5) | ☐ |
| Set up daily budget summary email/Discord | ☐ |
| Create x402_STATUS.md with current state | ☐ |
| Run final end-to-end test (all 13 agents) | ☐ |
| Verify all agents can make autonomous payments | ☐ |
| Verify budget enforcement working correctly | ☐ |
| Create handoff document for production team | ☐ |
| Archive all test data and logs | ☐ |

**End of Day 2 Deliverables:**
| Deliverable | Status |
|-------------|--------|
| Dashboard showing real-time x402 metrics | ☐ |
| Discord notifications working for all payment events | ☐ |
| Mainnet operational with 10 successful businesses | ☐ |
| All 13 agents autonomously paying for resources | ☐ |
| Operational runbook complete | ☐ |
| Wallet addresses and keys securely documented | ☐ |
| No critical bugs remaining | ☐ |
| Production-ready handoff complete | ☐ |

---

## 48-Hour Timeline Summary

| Time | Milestone |
|------|-----------|
| **Hour 0-2** | Infrastructure setup |
| **Hour 2-4** | Wallet creation & funding |
| **Hour 4-16** | All 13 agents integrated |
| **Hour 16-20** | Dashboard & Discord |
| **Hour 20-28** | Testnet + Mainnet deployment |
| **Hour 28-32** | Optimization & docs |

**Total Time:** 32 hours (2 days with breaks)
**Parallel Work:** Can be split across 2 engineers for 16-hour completion

---

## Parallel Execution Strategy (16 hours with 2 engineers)

### Engineer 1: Infrastructure & Core Agents (Hours 1-16)
- Hours 1-2: x402Client, Middleware, WalletManager, BudgetEnforcer
- Hours 3-4: Wallet setup and funding
- Hours 5-12: Integrate Research, Builder, QA, Deploy, SEO, Content, Marketing, Commerce agents (8 agents)
- Hours 13-16: Dashboard integration

### Engineer 2: Remaining Agents + Monitoring (Hours 1-16)
- Hours 1-4: Setup development environment, study x402 protocol
- Hours 5-10: Integrate Finance, Pricing, Support, Email, Analyst agents (5 agents)
- Hours 11-12: Genesis Meta Agent integration
- Hours 13-16: Discord integration + testing

### Combined: Production Deployment (Hours 17-32)
- Hours 17-24: Testnet testing (both engineers)
- Hours 25-28: Mainnet deployment (both engineers)
- Hours 29-32: Optimization, bug fixes, documentation (both engineers)

**Compressed Timeline:** 32 hours → 16 hours with 2 engineers working in parallel

---

## Part 9: Success Metrics

### 9.1 Technical Metrics

- [ ] **Payment Success Rate:** >99%
- [ ] **Payment Latency:** <5 seconds
- [ ] **Gas Cost per Payment:** <$0.02
- [ ] **Wallet Uptime:** 100%
- [ ] **Budget Enforcement:** 100% (no overruns)

### 9.2 Business Metrics

- [ ] **Cost Savings vs Subscriptions:** Track monthly
- [ ] **Agent Autonomy:** % of payments without human approval
- [ ] **Resource Access:** # of paid APIs now accessible
- [ ] **Business Quality:** Improvement from premium resources

### 9.3 Operational Metrics

- [ ] **Wallet Balance Alerts:** <1 per week
- [ ] **Budget Warnings:** <5 per week
- [ ] **Payment Failures:** <1% of total
- [ ] **Fraud Incidents:** 0

---

## Part 10: Future Enhancements

### 10.1 Advanced Features

- [ ] **Payment Batching:** Combine multiple small payments to reduce gas
- [ ] **Multi-Chain Support:** Use cheapest chain per payment (Base vs Solana vs Ethereum)
- [ ] **Smart Routing:** Automatically choose free API if available, paid if not
- [ ] **Price Negotiation:** Agent negotiates lower price for bulk usage

### 10.2 Integration with Other Systems

- [ ] **x402 + HopX:** Pay for ephemeral compute environments
- [ ] **x402 + AP2:** Coordinated payment strategy (small=x402, large=AP2)
- [ ] **x402 + Discord:** Rich payment notifications with blockchain explorer links

### 10.3 Revenue Opportunities

- [ ] **Offer Genesis as x402 Service:** Other agents can pay Genesis for business generation
- [ ] **x402 Marketplace:** Genesis agents offer services to external clients
- [ ] **Revenue Share:** Genesis earns USDC from providing AI services

---

## Summary

**x402 Integration Benefits:**
- ✅ **Agent Autonomy:** All 13 agents pay for resources without human approval
- ✅ **Instant Payments:** 2-second settlement via blockchain
- ✅ **Pay-Per-Use:** No subscriptions, only pay for what's used
- ✅ **Premium Access:** Unlock paid APIs, compute, data feeds across all agent types
- ✅ **Cost Control:** Daily budgets per agent prevent runaway spending
- ✅ **Transparency:** All payments visible on blockchain + Discord

**Agents with x402 Integration (13 Total):**
1. Research Agent - Premium data APIs
2. Builder Agent - LLM APIs, code generation
3. QA Agent - Cloud compute for testing
4. Deploy Agent - Serverless compute
5. SEO Agent - SEO tools (Ahrefs, SEMrush)
6. Content Agent - Stock media
7. Marketing Agent - Ad platform APIs
8. **Commerce Agent** - Domains, payment gateways, tax APIs
9. **Finance Agent** - Payroll, invoicing, financial reports
10. **Pricing Agent** - Pricing intelligence, experiments
11. **Support Agent** - Helpdesk, live chat, transcription
12. **Email Agent** - Email services, validation
13. **Analyst Agent** - Analytics platforms, data warehouses
14. Genesis Meta Agent - Orchestration compute, premium LLMs

**Implementation Timeline:**
- **Day 1 (16 hours):** Core client + wallet management + all 13 agent integrations
- **Day 2 (16 hours):** Dashboard + Discord + testnet + mainnet deployment
- **Total:** 2 days (32 hours solo) OR 1 day (16 hours with 2 engineers in parallel)

**Total Cost:**
- Implementation: 2 days engineering (32 hours solo OR 16 hours with 2 engineers)
- Operational: $4,591/month (100 businesses/month, hybrid approach)
- Operational: $7,980/month (100 businesses/month, pure x402)
- Break-even vs subscriptions: 40-50 businesses/month

**Cost Optimization:**
- <40 businesses/month: Pure x402 = $1,500-3,000/month (cheaper than subscriptions)
- 40-100 businesses/month: Hybrid approach = $4,591/month (42% savings vs pure x402)
- >100 businesses/month: Mostly subscriptions with x402 for specialized needs

**ROI:**
- Unlock premium resources (previously inaccessible)
- Full agent autonomy (no human bottleneck for <$10 purchases)
- Pay-per-use eliminates idle subscription costs at low volume
- Blockchain transparency (complete audit trail)
- Hybrid approach provides best cost efficiency at scale

---

**Status:** Ready to implement
**Next Step:** Install x402 SDK and create wallets for all 13 agents
**Timeline:** 2 days (48 hours total with breaks) OR 1 day (16 hours with 2 engineers in parallel)
**Agents Covered:** ALL 13 agents with AP2 integration now have complete x402 integration plan
