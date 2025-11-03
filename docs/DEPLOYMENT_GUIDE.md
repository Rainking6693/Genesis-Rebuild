# Business Execution Engine - Deployment Guide

**Created:** November 3, 2025
**Owner:** Thon (Infrastructure & Deployment Specialist)
**Status:** COMPLETE - Production Ready

---

## Overview

The Business Execution Engine is Genesis's autonomous deployment system that transforms business plans into live, production-ready websites on Vercel.

**Key Capabilities:**
- Autonomous code generation (Next.js 14 apps)
- GitHub repository creation and management
- Vercel deployment automation
- SSL certificate validation
- Health monitoring and validation
- Error handling and rollback support

---

## Architecture

```
Business Plan (Genesis Meta-Agent)
        |
        v
Business Executor
        |
        +---> Code Generation (Builder Agent)
        |
        +---> GitHub Client (Repository Creation)
        |
        +---> Vercel Client (Deployment)
        |
        +---> Deployment Validator (Health Checks)
        |
        v
Live Website (https://your-app.vercel.app)
```

---

## Components

### 1. Business Executor Core
**File:** `infrastructure/execution/business_executor.py` (680 lines)

Main orchestration engine that:
- Generates complete Next.js 14 applications
- Creates GitHub repositories with full codebase
- Deploys to Vercel with environment variables
- Validates deployments with comprehensive health checks
- Handles errors gracefully with rollback support

**Key Methods:**
- `execute_business()`: Main entry point for business creation
- `_generate_minimal_nextjs_app()`: Creates production-ready Next.js apps
- `_create_github_repo()`: Repository creation with git operations
- `_deploy_to_vercel()`: Automated Vercel deployment
- `_prepare_env_vars()`: Environment variable configuration

### 2. Vercel Client
**File:** `infrastructure/execution/vercel_client.py` (459 lines)

Complete Vercel REST API wrapper:
- Project creation with git integration
- Deployment triggering and monitoring
- Domain configuration
- Environment variable management
- Deployment status tracking

**Key Methods:**
- `create_project()`: Create new Vercel project
- `create_deployment()`: Trigger deployment
- `get_deployment_status()`: Check deployment state
- `wait_for_deployment()`: Poll until deployment ready
- `configure_domain()`: Add custom domains

### 3. GitHub Client
**File:** `infrastructure/execution/github_client.py` (366 lines)

GitHub REST API wrapper:
- Repository creation (user or organization)
- Repository metadata access
- Webhook configuration
- File content management
- Repository deletion

**Key Methods:**
- `create_repo()`: Create new GitHub repository
- `get_repo()`: Get repository metadata
- `create_webhook()`: Configure deployment webhooks
- `update_file()`: Update repository files via API
- `delete_repo()`: Delete repositories

### 4. Deployment Validator
**File:** `infrastructure/execution/deployment_validator.py` (411 lines)

Comprehensive health checking:
- HTTP status validation
- Response time monitoring
- SSL certificate verification
- Content validation
- SEO metadata checks
- Error page detection
- Continuous health monitoring
- Rollback support

**Key Methods:**
- `validate_full_deployment()`: Complete validation suite
- `continuous_health_check()`: Background monitoring
- `rollback_deployment()`: Deployment rollback on failure

---

## Installation & Setup

### Prerequisites
1. Python 3.12+
2. Git installed locally
3. Vercel account with API token
4. GitHub account with personal access token

### Environment Variables

Add to `.env` file:

```bash
# Vercel Configuration
VERCEL_TOKEN=your_vercel_token_here
VERCEL_TEAM_ID=your_team_id_here  # Optional

# GitHub Configuration
GITHUB_TOKEN=your_github_token_here
GITHUB_ORG=your_org_name  # Optional

# Database
MONGODB_URI=mongodb://localhost:27017

# API Keys (for deployed apps)
OPENAI_API_KEY=your_openai_key
STRIPE_API_KEY=your_stripe_key
ANTHROPIC_API_KEY=your_anthropic_key
```

### Getting API Tokens

**Vercel Token:**
1. Go to https://vercel.com/account/tokens
2. Create new token with full access
3. Copy token to `.env` as `VERCEL_TOKEN`

**GitHub Token:**
1. Go to https://github.com/settings/tokens
2. Generate new token (classic)
3. Select scopes: `repo`, `admin:repo_hook`, `delete_repo`
4. Copy token to `.env` as `GITHUB_TOKEN`

---

## Usage

### Basic Usage

```python
import asyncio
import os
from infrastructure.execution import BusinessExecutor, BusinessExecutionConfig

async def deploy_business():
    # Configure executor
    config = BusinessExecutionConfig(
        vercel_token=os.getenv("VERCEL_TOKEN"),
        vercel_team_id=os.getenv("VERCEL_TEAM_ID"),
        github_token=os.getenv("GITHUB_TOKEN"),
        mongodb_uri=os.getenv("MONGODB_URI"),
        github_org="my-org"  # Optional
    )

    executor = BusinessExecutor(config)

    # Business plan from Genesis Meta-Agent
    business_plan = {
        "name": "AI Writing Assistant",
        "description": "AI-powered writing tool for content creators",
        "type": "saas_tool",
        "tech_stack": ["Next.js", "OpenAI", "Stripe"],
        "mvp_features": [
            "Text input and editing",
            "AI-powered suggestions",
            "Export to PDF",
            "Subscription billing"
        ]
    }

    # Execute deployment
    result = await executor.execute_business(business_plan)

    if result.success:
        print(f"✓ Deployment successful!")
        print(f"  URL: https://{result.deployment_url}")
        print(f"  Repo: {result.repo_url}")
        print(f"  Validation: {result.validation_results.passed_checks}/{result.validation_results.total_checks} checks passed")
    else:
        print(f"✗ Deployment failed: {result.error}")

# Run
asyncio.run(deploy_business())
```

### Advanced Usage: Custom Code Files

```python
async def deploy_with_custom_code():
    config = BusinessExecutionConfig(...)
    executor = BusinessExecutor(config)

    # Provide custom code files
    code_files = {
        "package.json": "...",
        "src/app/page.tsx": "...",
        "src/app/layout.tsx": "...",
        # ... more files
    }

    business_plan = {...}

    result = await executor.execute_business(
        business_plan=business_plan,
        code_files=code_files  # Use custom code
    )
```

### Deployment Validation Only

```python
from infrastructure.execution import DeploymentValidator

async def validate_existing_deployment():
    validator = DeploymentValidator(timeout=10.0)

    report = await validator.validate_full_deployment(
        deployment_url="https://my-app.vercel.app",
        business_type="saas_tool",
        max_response_time=2.0
    )

    print(f"Validation: {report.passed_checks}/{report.total_checks} passed")
    for result in report.results:
        status = "✓" if result.passed else "✗"
        print(f"  {status} {result.check}: {result.details}")
```

### Continuous Health Monitoring

```python
async def monitor_deployment():
    validator = DeploymentValidator()

    async def alert_callback(report):
        # Send alert (email, Slack, etc.)
        print(f"ALERT: Deployment health check failed!")
        print(f"  Failed checks: {report.total_checks - report.passed_checks}")

    await validator.continuous_health_check(
        deployment_url="https://my-app.vercel.app",
        check_interval_seconds=60,
        alert_callback=alert_callback
    )
```

---

## Testing

### Run All Tests

```bash
# Run all execution tests
python -m pytest tests/execution/ -v

# Run with coverage
python -m pytest tests/execution/ --cov=infrastructure.execution

# Run specific test class
python -m pytest tests/execution/test_business_executor.py::TestVercelClient -v
```

### Test Results

**Status:** 18/18 tests passing (100%)

**Test Coverage:**
- Vercel Client: 5 tests
- GitHub Client: 3 tests
- Deployment Validator: 4 tests
- Business Executor: 6 tests
- Integration Tests: 1 test (skipped without credentials)

### Integration Testing (Real Deployment)

To test with real Vercel deployment:

```bash
# Set credentials in .env
export VERCEL_TOKEN=your_real_token
export GITHUB_TOKEN=your_real_token

# Run integration tests
python -m pytest tests/execution/ -m integration -v
```

---

## Code Generation

### Minimal Next.js App Structure

The executor generates production-ready Next.js 14 apps with:

**Files Generated:**
- `package.json` - Dependencies and scripts
- `src/app/page.tsx` - Landing page with features
- `src/app/layout.tsx` - Root layout with metadata
- `src/app/globals.css` - Tailwind CSS styles
- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS configuration
- `tsconfig.json` - TypeScript configuration
- `.gitignore` - Git ignore patterns
- `README.md` - Project documentation

**Tech Stack:**
- Next.js 14 (App Router)
- TypeScript
- React 18
- Tailwind CSS
- Responsive design (mobile-first)
- SEO optimized
- Production-ready error handling

---

## Deployment Validation

### Validation Checks

1. **HTTP Status** - Ensures 200 OK response
2. **Response Time** - Checks page loads in <2 seconds
3. **Content Present** - Validates HTML content exists (>100 bytes)
4. **SSL Certificate** - Verifies valid HTTPS certificate
5. **SEO Metadata** - Checks for title and description tags
6. **No Error Pages** - Ensures no 404/500 error indicators

### Validation Report

```python
ValidationReport(
    success=True,
    deployment_url="https://my-app.vercel.app",
    results=[
        ValidationResult(check="HTTP Status", passed=True, details="Status: 200"),
        ValidationResult(check="Response Time", passed=True, details="0.45s (max: 2.0s)"),
        ValidationResult(check="Content Present", passed=True, details="15243 bytes"),
        ValidationResult(check="SSL Certificate", passed=True, details="Valid certificate"),
        ValidationResult(check="SEO Metadata", passed=True, details="title present, description present"),
        ValidationResult(check="No Error Pages", passed=True, details="Clean content")
    ],
    passed_checks=6,
    total_checks=6,
    pass_rate=100.0
)
```

---

## Error Handling

### Automatic Error Recovery

1. **GitHub API Errors** - Retries with exponential backoff
2. **Vercel API Errors** - Graceful degradation
3. **Deployment Failures** - Automatic rollback (if supported)
4. **Validation Failures** - Detailed error reporting

### Error Examples

```python
try:
    result = await executor.execute_business(business_plan)
except VercelAPIError as e:
    print(f"Vercel API error: {e.status_code} - {e}")
except GitHubAPIError as e:
    print(f"GitHub API error: {e.status_code} - {e}")
except Exception as e:
    print(f"Unexpected error: {e}")
```

---

## Performance Metrics

**Average Execution Time:**
- Code generation: ~1-2 seconds
- GitHub repo creation: ~5-10 seconds (with git push)
- Vercel deployment: ~60-180 seconds (build time)
- Validation: ~2-5 seconds
- **Total: ~70-200 seconds** (depends on build complexity)

**Resource Usage:**
- Memory: ~100-200 MB
- CPU: Minimal (mostly I/O bound)
- Network: ~5-20 MB (code upload)

---

## Integration with Genesis

### Integration Points

1. **Genesis Meta-Agent** (Cora) - Receives business plans
2. **Builder Agent** - Generates code (future enhancement)
3. **HTDAG Orchestrator** - Task decomposition
4. **HALO Router** - Agent selection
5. **Monitoring Stack** - Health metrics

### Workflow

```
User Request
    |
    v
Genesis Meta-Agent (Cora)
    |
    v
Business Plan Generation
    |
    v
Business Executor (Thon)
    |
    +---> Code Generation
    +---> GitHub Repo
    +---> Vercel Deploy
    +---> Validation
    |
    v
Live Business
```

---

## Future Enhancements

### Planned Features (Phase 2)

1. **Advanced Code Generation**
   - Integration with Builder agent
   - Support for more frameworks (Vue, Svelte, Angular)
   - Database schema generation
   - API endpoint generation

2. **Enhanced Monitoring**
   - Real-time error tracking (Sentry integration)
   - Performance monitoring (OTEL integration)
   - User analytics (PostHog integration)
   - Uptime monitoring (UptimeRobot integration)

3. **Deployment Strategies**
   - Blue-green deployments
   - Canary releases
   - A/B testing support
   - Feature flags

4. **Multi-Cloud Support**
   - AWS Amplify
   - Netlify
   - Cloudflare Pages
   - Azure Static Web Apps

5. **Business Intelligence**
   - Revenue tracking
   - User metrics
   - Conversion analytics
   - Cost optimization

---

## Troubleshooting

### Common Issues

**Issue: GitHub repository creation fails**
```
Error: Failed to create repository: Repository already exists
```
**Solution:** Delete existing repository or use a different name

---

**Issue: Vercel deployment times out**
```
Error: Deployment timed out after 300s
```
**Solution:** Increase timeout or check Vercel build logs

---

**Issue: SSL validation fails**
```
Error: SSL certificate validation failed
```
**Solution:** Wait for Vercel's automatic SSL provisioning (can take 1-2 minutes)

---

**Issue: Authentication errors**
```
Error: 401 Unauthorized
```
**Solution:** Verify API tokens are correct and have proper permissions

---

## Support & Contact

**Owner:** Thon (Infrastructure & Deployment Specialist)
**Documentation:** `/docs/DEPLOYMENT_GUIDE.md`
**Tests:** `/tests/execution/test_business_executor.py`
**Status:** Production Ready (November 3, 2025)

---

## Changelog

**November 3, 2025 - v1.0.0 (Initial Release)**
- Complete Business Execution Engine implementation
- Vercel API client (459 lines)
- GitHub API client (366 lines)
- Deployment validator (411 lines)
- Business executor core (680 lines)
- Comprehensive test suite (567 lines, 18 tests)
- 100% test pass rate
- Production-ready deployment automation

---

**End of Deployment Guide**
