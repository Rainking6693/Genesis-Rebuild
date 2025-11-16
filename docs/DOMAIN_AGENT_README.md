# Domain Agent - Comprehensive Guide

## Overview

The **DomainAgent** is an AI-powered domain name discovery and registration system integrated with Name.com API. It automates the entire domain acquisition workflow for Genesis-generated businesses.

## Features

✅ **AI-Powered Domain Generation** - Creates creative, brandable domain suggestions
✅ **Name.com API Integration** - Direct integration with both development and production APIs
✅ **Availability Checking** - Real-time domain availability verification
✅ **Automated Registration** - One-click domain registration with customizable settings
✅ **MemoryOS Integration** - Learns from past successful domains
✅ **Smart Scoring** - Multi-factor domain quality scoring (0-100)
✅ **Portfolio Management** - Track and manage all registered domains

## API Credentials

### Development/Test Environment
- **API Base:** `https://api.dev.name.com`
- **Username:** `rainking6693@gmail.com-test`
- **Token:** `6eccb09af0f9516f5a55748a87cadd8396fa5260`
- **Use for:** Testing, development, dry-runs

### Production Environment
- **API Base:** `https://api.name.com`
- **Username:** `rainking6693@gmail.com`
- **Token Name:** `Genesis`
- **Token:** `1418f67ec72490d7d7660902111245f6a8e368d6`
- **Use for:** Actual domain registrations

## Installation

```bash
# Install dependencies
pip install aiohttp

# The agent is located at:
/home/genesis/genesis-rebuild/agents/domain_agent.py
```

## Quick Start

### 1. Basic Usage - Suggest Domains

```python
import asyncio
from agents.domain_agent import get_domain_agent

async def main():
    # Initialize in development mode (safe for testing)
    agent = await get_domain_agent(use_production=False, enable_memory=True)

    # Generate domain suggestions
    suggestions = await agent.suggest_domains(
        business_name="EcoFinance AI",
        business_type="fintech",
        count=10
    )

    # Display results
    for sugg in suggestions:
        print(f"{sugg.domain} - Score: {sugg.score}/100 - ${sugg.price_usd}")

asyncio.run(main())
```

### 2. Check Availability

```python
# Check if a specific domain is available
result = await agent.check_availability("ecofinance-ai.com")

if result.get("purchasable"):
    print(f"✅ Available for ${result.get('purchasePrice')}")
else:
    print("❌ Not available")
```

### 3. Register a Domain (Production Only)

```python
# Initialize in PRODUCTION mode
agent = await get_domain_agent(use_production=True)

# Register domain
registration = await agent.register_domain(
    domain="ecofinance-ai.com",
    years=2,                 # Register for 2 years
    auto_renew=True,         # Enable auto-renewal
    privacy=True             # Enable WHOIS privacy
)

if registration.success:
    print(f"✅ Registered! Order ID: {registration.order_id}")
    print(f"Total paid: ${registration.total_paid}")
else:
    print(f"❌ Failed: {registration.error}")
```

### 4. List Your Domains

```python
# Get all domains in your portfolio
domains = await agent.list_domains()

for domain in domains:
    print(f"{domain['domainName']} - Expires: {domain['expireDate']}")
```

## CLI Usage

The agent includes a built-in CLI for quick testing:

```bash
# Suggest domains
python3 agents/domain_agent.py suggest "EcoFinance AI" fintech

# Check availability
python3 agents/domain_agent.py check ecofinance-ai.com

# List portfolio
python3 agents/domain_agent.py list
```

## Domain Generation Strategies

The DomainAgent uses 5 intelligent strategies to generate domain names:

### 1. Direct Conversion
- `ecofinanceai.com`
- `eco-finance-ai.com`

### 2. Abbreviations
- `efai.com` (first letters)
- `efa.ai` (shorter version)

### 3. Trendy Prefixes
- `getecofinance.com`
- `tryecofinance.ai`
- `myecofinance.io`
- `useecofinance.app`

### 4. Industry Keywords
For **fintech**:
- `ecopay.com`
- `ecowallet.ai`
- `ecocash.io`

For **saas**:
- `ecoapp.com`
- `ecohub.ai`
- `ecoplatform.io`

For **ecommerce**:
- `ecoshop.com`
- `ecostore.io`
- `ecomarket.app`

### 5. Two-Word Combinations
- `ecofinance.com`
- `financeeco.ai`

## Domain Scoring Algorithm

Domains are scored 0-100 based on:

| Factor | Weight | Description |
|--------|--------|-------------|
| **Length** | 20 pts | Optimal: 6-12 characters |
| **TLD Quality** | 25 pts | .com (25), .ai (20), .io (18), .app (15) |
| **Brand Alignment** | 15 pts | Contains business name |
| **Simplicity** | -5 to -10 pts | Penalties for hyphens, numbers |

**Example Scores:**
- `ecofinance.com` → 95/100 (perfect length, premium TLD, exact match)
- `eco-finance-ai.com` → 75/100 (hyphens penalty)
- `ecofinance123.com` → 60/100 (numbers penalty)

## Integration with Business Generation

### Add to Genesis Workflow

```python
# In ten_business_simple_test.py, add after BusinessGenerationAgent:

# 2. Domain Registration
logger.info(f"[{index}] Finding domain...")
from agents.domain_agent import get_domain_agent

domain_agent = await get_domain_agent(use_production=False)
business_data["agents_used"].append("DomainAgent")

suggestions = await domain_agent.suggest_domains(
    business_name=idea.name,
    business_type=business_type,
    count=5
)

if suggestions:
    best_domain = suggestions[0]
    business_data["domain"] = best_domain.domain
    business_data["domain_score"] = best_domain.score
    logger.info(f"✓ [{index}] Domain: {best_domain.domain} (score: {best_domain.score})")
```

## API Reference

### Class: `DomainAgent`

#### Constructor
```python
DomainAgent(
    use_production: bool = False,
    enable_memory: bool = True,
    agent_name: str = "domain_agent"
)
```

#### Methods

**`suggest_domains()`**
```python
await agent.suggest_domains(
    business_name: str,
    business_type: str,
    count: int = 10,
    tlds: Optional[List[str]] = None,
    user_id: str = "default"
) -> List[DomainSuggestion]
```

**`check_availability()`**
```python
await agent.check_availability(
    domain: str
) -> Dict[str, Any]
```

**`register_domain()`**
```python
await agent.register_domain(
    domain: str,
    years: int = 1,
    auto_renew: bool = True,
    privacy: bool = True
) -> DomainRegistration
```

**`list_domains()`**
```python
await agent.list_domains() -> List[Dict[str, Any]]
```

## Data Models

### `DomainSuggestion`
```python
@dataclass
class DomainSuggestion:
    domain: str              # e.g., "ecofinance.com"
    is_available: bool       # True if can be registered
    price_usd: float         # Registration cost
    tld: str                 # Top-level domain (com, ai, io)
    score: float             # Quality score 0-100
    reasoning: str           # Why this domain was suggested
```

### `DomainRegistration`
```python
@dataclass
class DomainRegistration:
    domain: str              # Registered domain
    success: bool            # True if registration succeeded
    order_id: str            # Name.com order ID
    total_paid: float        # Amount charged
    error: Optional[str]     # Error message if failed
    registered_at: datetime  # Timestamp
```

## MemoryOS Integration

The agent learns from successful domains over time:

- **Stores:** Domain searches, registrations, user preferences
- **Recalls:** Successful patterns for similar business types
- **Learns:** Which domain styles work best for each industry

## Safety Features

✅ **Development Mode Default** - Prevents accidental production registrations
✅ **Explicit Production Flag** - Must set `use_production=True` for real registrations
✅ **Mock Registrations** - Development mode simulates registrations without charging
✅ **Rate Limiting** - Prevents API abuse with sleep intervals
✅ **Error Handling** - Graceful failure with detailed error messages

## Troubleshooting

### Issue: 403 Permission Denied

**Cause:** API credentials may need additional scopes or the test account has limitations.

**Solution:**
1. Verify credentials are correct
2. Check Name.com dashboard for API token permissions
3. Contact Name.com support to enable search API access for test account

### Issue: 405 Method Not Allowed

**Cause:** Wrong HTTP method for endpoint.

**Solution:** The agent has been updated to use POST for search endpoint.

### Issue: No domains found

**Cause:** All generated domains are taken.

**Solution:**
- Try different TLDs (.ai, .io, .app instead of .com)
- Use more creative prefixes/suffixes
- Check longer/abbreviated versions

## Name.com API Documentation

For full API reference, see:
- **Development:** https://api.dev.name.com/docs
- **Production:** https://www.name.com/api-docs

Key endpoints used:
- `POST /v4/domains:search` - Check availability
- `POST /v4/domains` - Register domain
- `GET /v4/domains` - List domains

## Future Enhancements

Planned features:
- [ ] DNS configuration automation
- [ ] Email forwarding setup
- [ ] SSL certificate provisioning
- [ ] Subdomain management
- [ ] Domain transfer support
- [ ] Bulk registration
- [ ] Advanced filtering (length, keywords, price)
- [ ] A/B testing domain suggestions
- [ ] Integration with Vercel for instant deployment

## Support

For issues or questions:
1. Check logs for detailed error messages
2. Verify API credentials
3. Test with development API first
4. Review Name.com API status: https://status.name.com

## License

Part of Genesis AI Platform - Internal Use Only

---

**Created:** November 15, 2025
**Version:** 1.0.0
**Location:** `/home/genesis/genesis-rebuild/agents/domain_agent.py`
