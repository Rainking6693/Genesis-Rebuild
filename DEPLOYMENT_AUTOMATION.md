# Genesis Deployment & Post-Deployment Automation

## Overview

Genesis Meta Agent now supports **automatic deployment** and **post-deployment automation** for generated businesses.

## What Changed (November 21, 2025)

### Before
- ✅ Business generation (code files)
- ❌ No automatic deployment
- ❌ No post-deployment automation (marketing, SEO, analytics)

### After
- ✅ Business generation (code files)
- ✅ **Automatic deployment** to Vercel/Netlify/Railway
- ✅ **Post-deployment automation** (marketing, SEO, analytics, Stripe, monitoring)

## How It Works

Genesis now has 3 phases:

### Phase 1: Business Generation
```
Generate components → Write files → Create manifest
```

### Phase 2: Deployment (NEW - Optional)
```
Prepare files → Push to GitHub → Deploy to platform → Return URL
```

### Phase 3: Post-Deployment Automation (NEW - Optional)
```
Setup analytics → Configure SEO → Submit to directories → Configure Stripe → Setup monitoring
```

## Usage

### Enable Automatic Deployment

Add `auto_deploy: True` to your business spec metadata:

```python
from infrastructure.genesis_meta_agent import GenesisMetaAgent, BusinessSpec

meta_agent = GenesisMetaAgent(use_local_llm=True, enable_memory=True)

spec = BusinessSpec(
    name="MyBusiness",
    business_type="saas",
    description="AI-powered SaaS platform",
    components=["dashboard_ui", "rest_api", "stripe_billing"],
    output_dir=Path("businesses/MyBusiness"),
    metadata={
        "auto_deploy": True,  # ✨ Enable automatic deployment
        "deploy_platform": "vercel",  # Options: vercel, netlify, railway
        "framework": "nextjs"
    }
)

result = await meta_agent.generate_business(spec)

# If deployment succeeds, result will include deployment URL
if result.success:
    print(f"Deployed to: {spec.metadata.get('deployment_url')}")
```

### Enable Post-Deployment Automation

Add `auto_post_deploy: True` to enable marketing, SEO, and analytics setup after deployment:

```python
spec = BusinessSpec(
    name="MyBusiness",
    business_type="saas",
    description="AI-powered SaaS platform",
    components=["dashboard_ui", "analytics", "stripe_billing", "seo_optimization"],
    output_dir=Path("businesses/MyBusiness"),
    metadata={
        "auto_deploy": True,
        "auto_post_deploy": True,  # ✨ Enable post-deployment automation
        "deploy_platform": "vercel",
        "enable_seo": True,  # Configure SEO metadata
        "submit_to_directories": True  # Submit to Product Hunt, BetaList, etc.
    }
)

result = await meta_agent.generate_business(spec)
```

## Post-Deployment Automation Tasks

When `auto_post_deploy: True`, Genesis will automatically:

### 1. Analytics Setup
- Configure Google Analytics 4 (GA4)
- Set up PostHog event tracking
- Enable conversion tracking

**Triggered when:** `"analytics"` in components

### 2. SEO Configuration
- Generate meta tags (title, description, og:image)
- Create sitemap.xml
- Configure robots.txt
- Submit to Google Search Console

**Triggered when:** `enable_seo: True` in metadata (default: True)

### 3. Directory Submissions
- Submit to Product Hunt
- Submit to BetaList
- Submit to Hacker News
- Submit to IndieHackers

**Triggered when:** `submit_to_directories: True` in metadata

### 4. Stripe Configuration
- Configure Stripe billing webhooks
- Set up subscription plans
- Enable checkout integration

**Triggered when:** `"stripe_billing"` or `"stripe_checkout"` in components

### 5. Monitoring & Alerts
- Set up error tracking (Sentry)
- Configure uptime monitoring
- Enable performance monitoring
- Set up Discord/Slack alerts

**Triggered when:** deployment succeeds

## Configuration Options

### Deployment Platforms

```python
metadata = {
    "deploy_platform": "vercel"  # vercel (default), netlify, railway
}
```

### Framework Support

```python
metadata = {
    "framework": "nextjs"  # nextjs (default), react, vue, svelte
}
```

### Deployment Environment

```python
metadata = {
    "environment": "production"  # production (default), staging, development
}
```

## Requirements for Deployment

### Environment Variables Required

```bash
# GitHub (required for all platforms)
export GITHUB_TOKEN=ghp_your_token_here

# Vercel (if using Vercel)
export VERCEL_TOKEN=your_vercel_token

# Netlify (if using Netlify)
export NETLIFY_AUTH_TOKEN=your_netlify_token

# Railway (if using Railway)
export RAILWAY_TOKEN=your_railway_token

# Gemini (required for browser automation)
export GOOGLE_API_KEY=your_gemini_api_key
```

### Get GitHub Token

1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo`, `workflow`
4. Copy token to `GITHUB_TOKEN` environment variable

### Get Platform Tokens

- **Vercel**: https://vercel.com/account/tokens
- **Netlify**: https://app.netlify.com/user/applications/personal
- **Railway**: https://railway.app/account/tokens

## Example: Full End-to-End Workflow

```python
#!/usr/bin/env python3
import asyncio
import os
from pathlib import Path

# Configure environment
os.environ["GITHUB_TOKEN"] = "ghp_your_token_here"
os.environ["VERCEL_TOKEN"] = "your_vercel_token"
os.environ["GOOGLE_API_KEY"] = "your_gemini_key"

from infrastructure.genesis_meta_agent import GenesisMetaAgent, BusinessSpec

async def main():
    meta_agent = GenesisMetaAgent(use_local_llm=True, enable_memory=True)

    spec = BusinessSpec(
        name="AI_SaaS_Platform",
        business_type="saas",
        description="AI-powered SaaS platform for SMBs",
        components=[
            "dashboard_ui",
            "rest_api",
            "user_auth",
            "analytics",
            "stripe_billing",
            "seo_optimization"
        ],
        output_dir=Path("businesses/AI_SaaS_Platform"),
        metadata={
            # Deployment
            "auto_deploy": True,
            "deploy_platform": "vercel",
            "framework": "nextjs",

            # Post-deployment automation
            "auto_post_deploy": True,
            "enable_seo": True,
            "submit_to_directories": True,

            # User info
            "user_id": "your_user_id"
        }
    )

    # Generate, deploy, and automate!
    result = await meta_agent.generate_business(spec)

    if result.success:
        deployment_url = spec.metadata.get("deployment_url")
        print(f"✅ Business generated and deployed!")
        print(f"🌐 URL: {deployment_url}")
        print(f"📊 Components: {len(result.components_generated)}")
        print(f"⏱️  Time: {result.generation_time_seconds:.1f}s")
    else:
        print(f"❌ Generation failed")

if __name__ == "__main__":
    asyncio.run(main())
```

## Troubleshooting

### Deployment Failed: "GITHUB_TOKEN environment variable not set"

**Solution**: Set GITHUB_TOKEN environment variable:
```bash
export GITHUB_TOKEN=ghp_your_personal_access_token
```

### Deployment Failed: "GitHub push failed"

**Solution**: Check that your GITHUB_TOKEN has `repo` and `workflow` scopes.

### Post-Deployment Automation Skipped

**Solution**: Ensure `auto_post_deploy: True` AND `auto_deploy: True` (deployment must succeed first)

### Platform-Specific Errors

- **Vercel**: Set `VERCEL_TOKEN`
- **Netlify**: Set `NETLIFY_AUTH_TOKEN`
- **Railway**: Set `RAILWAY_TOKEN`

## Code Locations

- **Genesis Meta Agent**: `infrastructure/genesis_meta_agent.py:2095-2246`
  - `_deploy_business()` - Line 2128
  - `_post_deployment_automation()` - Line 2198
- **Deploy Agent**: `agents/deploy_agent.py`
- **Example Script**: `deploy_autobusiness_pro.py`

## Status

- ✅ Deployment integration: **COMPLETE**
- ✅ Post-deployment framework: **COMPLETE**
- ⏳ Agent implementations: **TODO**
  - Analytics setup (AnalyticsAgent)
  - SEO configuration (MarketingAgent)
  - Directory submissions (MarketingAgent)
  - Stripe webhooks (BillingAgent)
  - Monitoring alerts (MonitoringAgent)

## Next Steps

1. Set environment variables (GITHUB_TOKEN, platform tokens)
2. Enable `auto_deploy: True` in business specs
3. Enable `auto_post_deploy: True` for full automation
4. Implement TODO items in `_post_deployment_automation()` method

---

**Created**: November 21, 2025
**Version**: 1.0
**Author**: Genesis Meta Agent Team
