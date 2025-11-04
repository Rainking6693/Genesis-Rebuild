# Product Generation - Quick Start Guide

## Installation

```bash
# Install Anthropic SDK
pip install anthropic

# Set API key
export ANTHROPIC_API_KEY="sk-ant-..."
```

## Basic Usage

### Option 1: Automatic Detection (Recommended)

```python
from infrastructure.genesis_meta_agent import GenesisMetaAgent
from infrastructure.genesis_meta_agent import BusinessRequirements

# Initialize (auto-detects ANTHROPIC_API_KEY)
agent = GenesisMetaAgent()

# Create a SaaS business
result = await agent.create_business(
    business_type="saas",
    requirements=BusinessRequirements(
        name="TaskFlow Pro",
        description="Project management for remote teams",
        mvp_features=[
            "User authentication",
            "Task management",
            "Real-time updates"
        ],
        target_audience="Remote teams",
        monetization="Subscription"
    )
)

print(f"Deployed: {result.deployment_url}")
print(f"Quality Score: {result.quality_score}/100")
```

### Option 2: Explicit Configuration

```python
# Explicitly enable product generation
agent = GenesisMetaAgent(
    enable_product_generation=True,
    anthropic_api_key="sk-ant-..."
)
```

## Direct Product Generation

```python
from infrastructure.product_generator import ProductGenerator, ProductRequirements, BusinessType
from infrastructure.product_validator import ProductValidator

# Initialize
generator = ProductGenerator(anthropic_api_key="sk-ant-...")
validator = ProductValidator()

# Define requirements
requirements = ProductRequirements(
    business_type=BusinessType.SAAS,
    name="MyApp",
    description="A cool app",
    features=["auth", "dashboard", "api"],
    target_audience="Users",
    monetization_model="Free"
)

# Generate
product = await generator.generate_product(requirements)

# Validate
validation = await validator.validate_product(
    files=product.files,
    required_features=requirements.features,
    business_type="saas"
)

print(f"Generated {len(product.files)} files")
print(f"Quality: {validation.quality_score}/100")
print(f"Security issues: {len(validation.security_issues)}")
```

## Business Types

### SaaS Application
```python
BusinessType.SAAS
# Generates: Next.js 14 + Supabase + Tailwind CSS
# Includes: Auth, Dashboard, API routes, Database
```

### Content Website
```python
BusinessType.CONTENT
# Generates: Next.js 14 + MDX + Contentlayer
# Includes: Blog, SEO, RSS feed, Search
```

### E-commerce Store
```python
BusinessType.ECOMMERCE
# Generates: Next.js 14 + Stripe + Prisma + PostgreSQL
# Includes: Products, Cart, Checkout, Admin, Orders
```

## Validation Only

```python
from infrastructure.product_validator import ProductValidator

validator = ProductValidator()

# Validate existing code
files = {
    "app/page.tsx": "...",
    "app/api/data/route.ts": "..."
}

result = await validator.validate_product(
    files=files,
    required_features=["API routes", "Authentication"],
    business_type="saas"
)

print(f"Passed: {result.passed}")
print(f"Score: {result.quality_score}/100")

# Check security issues
for issue in result.security_issues:
    print(f"{issue.severity.value.upper()}: {issue.message} ({issue.file}:{issue.line})")
```

## Testing

```bash
# Run all tests
pytest tests/product/test_product_generation.py -v

# Run specific test
pytest tests/product/test_product_generation.py::TestProductGenerator::test_generate_saas_basic -v

# With coverage
pytest tests/product/ --cov=infrastructure.product_generator --cov=infrastructure.product_validator
```

## Fallback Behavior

If product generation is unavailable:

```python
# Will automatically use static site generation
agent = GenesisMetaAgent()  # No ANTHROPIC_API_KEY

result = await agent.create_business(business_type="saas", ...)
# Returns static HTML site instead of full application
```

## Environment Variables

```bash
# Required
ANTHROPIC_API_KEY=sk-ant-...

# Optional (for deployment)
VERCEL_TOKEN=...
VERCEL_TEAM_ID=...

# Optional (for payments in e-commerce)
STRIPE_SECRET_KEY=sk_test_...
```

## Cost Management

```python
# Each generation costs ~$0.027 (Claude Sonnet 4)

# Enable caching to reduce costs
generator = ProductGenerator(anthropic_api_key="...")

# First call - hits API
product1 = await generator.generate_product(reqs)  # $0.027

# Second call - uses cache
product2 = await generator.generate_product(reqs)  # $0.00
```

## Troubleshooting

### No Anthropic SDK

```bash
pip install anthropic
```

### Invalid API Key

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

### Generation Fails

System automatically falls back to static sites. Check logs:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Low Quality Score

```python
# Check validation results
print(validation.recommendations)
print(validation.security_issues)
print(validation.quality_issues)
```

## Examples

See:
- `docs/PRODUCT_GENERATION_IMPLEMENTATION_REPORT.md` - Full documentation
- `tests/product/test_product_generation.py` - Test examples
- `PRODUCT_GENERATION_SUMMARY.txt` - Quick reference

## File Structure

```
infrastructure/
├── product_generator.py      # Main generator (826 lines)
├── product_validator.py      # Validator (647 lines)
└── genesis_meta_agent.py     # Integration

tests/
└── product/
    └── test_product_generation.py  # Tests (625 lines, 25 tests)

docs/
└── PRODUCT_GENERATION_IMPLEMENTATION_REPORT.md  # Full docs
```

## Next Steps

1. Install Anthropic SDK: `pip install anthropic`
2. Set API key: `export ANTHROPIC_API_KEY="..."`
3. Run example: `python examples/product_generation_demo.py`
4. Review generated files
5. Deploy to Vercel

---

**Status:** Production Ready
**Version:** 1.0
**Date:** November 3, 2025
