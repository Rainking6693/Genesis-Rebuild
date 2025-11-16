# DomainAgent Setup & Troubleshooting

## Current Status

✅ **DomainAgent Created** - `/home/genesis/genesis-rebuild/agents/domain_agent.py`
✅ **Documentation Complete** - `/home/genesis/genesis-rebuild/docs/DOMAIN_AGENT_README.md`
✅ **DateTime Bug Fixed** - EmailMarketingAgent test issue resolved
⚠️ **API Access Issue** - Getting 403 Permission Denied from Name.com API

## Issue: 403 Permission Denied

### Problem
All Name.com API calls are returning `{"message":"Permission Denied"}` with HTTP 403 status.

### Affected Endpoints
- `POST /v4/domains:search` - Domain search/availability
- `GET /v4/domains` - List domains
- `POST /v4/domains` - Register domain

### Root Cause
The API token likely needs additional permissions/scopes enabled in the Name.com dashboard.

## How to Fix

### Step 1: Log into Name.com

**Development Account:**
- Username: `rainking6693@gmail.com-test`
- Dashboard: https://www.name.com/account

**Production Account:**
- Username: `rainking6693@gmail.com`
- Dashboard: https://www.name.com/account

### Step 2: Verify API Token Permissions

1. Go to **Account Settings** → **API Access**
2. Find the token named **"Genesis"** (production) or the test token
3. Check that the token has these permissions enabled:
   - ✅ Read Domains
   - ✅ Write Domains
   - ✅ Search Domains
   - ✅ Register Domains

### Step 3: Regenerate Token (if needed)

If permissions can't be modified:
1. Delete the existing token
2. Create a new token with ALL domain permissions
3. Update the credentials in `/home/genesis/genesis-rebuild/agents/domain_agent.py`:

```python
# Development config (lines 67-71)
NAMECOM_DEV_CONFIG = NameComConfig(
    environment=NameComEnvironment.DEVELOPMENT,
    username="rainking6693@gmail.com-test",
    token="NEW_TOKEN_HERE"  # ← Update this
)

# Production config (lines 73-77)
NAMECOM_PROD_CONFIG = NameComConfig(
    environment=NameComEnvironment.PRODUCTION,
    username="rainking6693@gmail.com",
    token="NEW_TOKEN_HERE"  # ← Update this
)
```

### Step 4: Test Again

After updating permissions or token:

```bash
# Test domain search
python3 agents/domain_agent.py suggest "Test Business" saas

# Test domain listing
python3 agents/domain_agent.py list

# Test single domain check
python3 agents/domain_agent.py check example.com
```

## Alternative: Contact Name.com Support

If the above doesn't work, contact Name.com support:

**Email:** support@name.com
**Phone:** 1-720-249-2374

**What to tell them:**
> "I'm trying to use the Name.com API v4 with my API token but getting 403 Permission Denied errors.
> I need access to the following endpoints:
> - POST /v4/domains:search (domain availability checking)
> - GET /v4/domains (list domains)
> - POST /v4/domains (register domains)
>
> My test account is: rainking6693@gmail.com-test
> My production account is: rainking6693@gmail.com
>
> Can you please enable full API access for domain operations on my tokens?"

## Alternative Solution: Use Name.com Web UI

Until API access is resolved, you can manually:
1. Visit https://www.name.com/domain/search
2. Search for domains suggested by the DomainAgent (see generated list)
3. Register domains through the web interface

The DomainAgent's AI suggestions are still valuable even if registration is manual.

## Testing Without API

You can test the domain generation logic offline:

```python
from agents.domain_agent import DomainAgent

# Create agent with memory disabled (avoids errors)
agent = DomainAgent(use_production=False, enable_memory=False)

# Generate candidate domain names (doesn't call API)
candidates = agent._generate_domain_candidates(
    business_name="EcoFinance AI",
    business_type="fintech",
    past_patterns=[],
    tlds=[".com", ".ai", ".io"],
    count=20
)

print("Generated domain ideas:")
for i, domain in enumerate(candidates, 1):
    score = agent._score_domain(domain, "EcoFinance AI", "fintech")
    print(f"{i}. {domain} (score: {score:.1f}/100)")
```

## Once API Works

When API access is confirmed working, you can:

### 1. Add to Business Generation Workflow

```python
# In ten_business_simple_test.py, after BusinessGenerationAgent:

# Domain Discovery (Agent 27)
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
    logger.info(f"✓ [{index}] Domain: {best_domain.domain}")
```

### 2. Automate Domain Registration

```python
# In production mode, automatically register best domain
if use_production_domains:
    domain_agent_prod = await get_domain_agent(use_production=True)

    registration = await domain_agent_prod.register_domain(
        domain=best_domain.domain,
        years=2,
        auto_renew=True,
        privacy=True
    )

    if registration.success:
        logger.info(f"✅ Registered {best_domain.domain}!")
```

## Summary

**What's Working:**
✅ DomainAgent code complete
✅ AI domain generation
✅ Scoring algorithm
✅ Mock/test mode
✅ Documentation
✅ DateTime bug fixed

**What Needs Setup:**
⚠️ Name.com API token permissions
⚠️ API access verification

**Next Steps:**
1. Configure API token permissions in Name.com dashboard
2. Test with `python3 agents/domain_agent.py list`
3. Once working, test domain search
4. Integrate into 25-agent workflow as agent #27

---

**File:** `/home/genesis/genesis-rebuild/docs/DOMAIN_AGENT_SETUP.md`
**Last Updated:** November 15, 2025
