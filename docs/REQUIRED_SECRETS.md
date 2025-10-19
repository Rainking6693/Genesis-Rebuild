# Required GitHub Secrets Documentation

**Document Version:** 1.0
**Last Updated:** October 18, 2025
**Owner:** Cora (Architecture Specialist)
**Status:** Production Ready

---

## Table of Contents

1. [Overview](#overview)
2. [Repository Secrets](#repository-secrets)
3. [Environment Secrets](#environment-secrets)
4. [Secret Configuration Guide](#secret-configuration-guide)
5. [Security Best Practices](#security-best-practices)
6. [Validation](#validation)

---

## Overview

This document lists all required GitHub secrets for the Genesis Rebuild CI/CD pipeline. Secrets are used for:
- External service authentication (LLM APIs, monitoring)
- Deployment credentials
- Notification webhooks
- Security scanning tools

**Critical:** These secrets MUST be configured before running CI/CD workflows.

---

## Repository Secrets

Repository secrets are available to all workflows across all branches.

### Required Secrets

#### 1. CODECOV_TOKEN
- **Purpose:** Upload test coverage reports to Codecov
- **Used in:** `.github/workflows/ci.yml` (coverage-analysis job)
- **How to get:**
  1. Go to [codecov.io](https://codecov.io)
  2. Sign in with GitHub
  3. Add repository: `genesis-rebuild`
  4. Copy repository upload token
- **Example:** `a1b2c3d4-e5f6-7890-abcd-ef1234567890`
- **Required:** YES (for coverage tracking)
- **Priority:** HIGH

#### 2. SLACK_WEBHOOK
- **Purpose:** Send deployment notifications and alerts to Slack
- **Used in:**
  - `.github/workflows/staging-deploy.yml` (notify job)
  - `.github/workflows/production-deploy.yml` (deployment-notification job)
- **How to get:**
  1. Go to Slack workspace settings
  2. Apps → Add App → Incoming Webhooks
  3. Choose channel: `#genesis-alerts` or `#genesis-deploys`
  4. Copy webhook URL
- **Example:** `https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX`
- **Required:** NO (deployments work without Slack)
- **Priority:** MEDIUM

#### 3. OPENAI_API_KEY
- **Purpose:** GPT-4o API access for orchestration decisions
- **Used in:** Runtime (loaded by application)
- **How to get:**
  1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
  2. Create new secret key
  3. Copy key immediately (shown once)
- **Example:** `sk-proj-abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMN`
- **Required:** YES (for LLM decomposition)
- **Priority:** CRITICAL

#### 4. ANTHROPIC_API_KEY
- **Purpose:** Claude Sonnet 4 API access for code generation
- **Used in:** Runtime (loaded by application)
- **How to get:**
  1. Go to [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)
  2. Create new API key
  3. Copy key
- **Example:** `sk-ant-api03-abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890`
- **Required:** YES (for code generation)
- **Priority:** CRITICAL

#### 5. MONITORING_API_KEY
- **Purpose:** Authentication for monitoring/observability services (Prometheus, Grafana, etc.)
- **Used in:** Runtime (OTEL exporter configuration)
- **How to get:**
  - Prometheus: No key required (self-hosted)
  - Grafana Cloud: Generate service account token
  - Datadog: Get API key from Organization Settings
- **Example:** `dd-api-1234567890abcdef1234567890abcdef`
- **Required:** NO (monitoring works without external services)
- **Priority:** MEDIUM

---

## Environment Secrets

Environment secrets are scoped to specific GitHub environments (staging, production).

### Staging Environment Secrets

Configure in: **Settings → Environments → staging → Environment secrets**

#### STAGING_DATABASE_URL
- **Purpose:** Database connection string for staging environment
- **Format:** `mongodb://username:password@hostname:27017/database`
- **Example:** `mongodb://genesis_staging:pass123@staging-db.example.com:27017/genesis`
- **Required:** YES (if using database features)
- **Priority:** HIGH

#### STAGING_API_KEYS
- **Purpose:** Third-party API keys for staging (non-production keys)
- **Format:** JSON object with key-value pairs
- **Example:**
  ```json
  {
    "openai": "sk-test-...",
    "anthropic": "sk-ant-test-...",
    "stripe_test": "sk_test_..."
  }
  ```
- **Required:** NO (use repository secrets if not set)
- **Priority:** LOW

### Production Environment Secrets

Configure in: **Settings → Environments → production → Environment secrets**

#### PRODUCTION_DATABASE_URL
- **Purpose:** Database connection string for production environment
- **Format:** `mongodb://username:password@hostname:27017/database?ssl=true&replicaSet=rs0`
- **Example:** `mongodb+srv://genesis_prod:SecurePass456@prod-cluster.mongodb.net/genesis?retryWrites=true&w=majority`
- **Required:** YES (for production data persistence)
- **Priority:** CRITICAL
- **Security:** Use connection string with:
  - SSL/TLS enabled (`ssl=true` or `mongodb+srv://`)
  - Strong password (20+ characters, mixed case, symbols)
  - IP whitelist configured
  - Read-only user for backups

#### PRODUCTION_API_KEYS
- **Purpose:** Production-grade API keys for third-party services
- **Format:** JSON object with key-value pairs
- **Example:**
  ```json
  {
    "openai_prod": "sk-...",
    "anthropic_prod": "sk-ant-...",
    "stripe_live": "sk_live_..."
  }
  ```
- **Required:** NO (use repository secrets if not set)
- **Priority:** MEDIUM

#### PAGERDUTY_TOKEN
- **Purpose:** PagerDuty routing key for critical production alerts
- **Used in:** `monitoring/production_alerts.yml`
- **How to get:**
  1. Go to PagerDuty → Services
  2. Select service (or create new: "Genesis Production")
  3. Integrations → Add integration → Events API v2
  4. Copy integration key
- **Example:** `R01234ABCDEFGHIJKLMNOPQRSTUVWXY`
- **Required:** NO (alerts work without PagerDuty)
- **Priority:** HIGH (recommended for production)

#### DOCKER_REGISTRY_TOKEN
- **Purpose:** Authentication for private Docker registry (if using)
- **Format:** Docker Hub personal access token or registry password
- **How to get:**
  - **Docker Hub:** Account Settings → Security → New Access Token
  - **GitHub Container Registry:** Settings → Developer settings → Personal access tokens → Generate (with `write:packages` scope)
- **Example:** `dckr_pat_abcdefghijklmnopqrstuvwxyz1234567890`
- **Required:** NO (if using public images)
- **Priority:** MEDIUM (if using private registry)

---

## Secret Configuration Guide

### Step 1: Access GitHub Repository Settings

```bash
# Via GitHub UI
1. Go to https://github.com/<your-org>/genesis-rebuild
2. Click "Settings" (repository settings)
3. In left sidebar, click "Secrets and variables" → "Actions"
```

### Step 2: Add Repository Secret

```bash
# Via GitHub UI
1. Click "New repository secret"
2. Name: CODECOV_TOKEN
3. Secret: <paste token>
4. Click "Add secret"
```

**Via GitHub CLI:**
```bash
gh secret set CODECOV_TOKEN --body="your-token-here"
gh secret set SLACK_WEBHOOK --body="https://hooks.slack.com/..."
gh secret set OPENAI_API_KEY --body="sk-proj-..."
gh secret set ANTHROPIC_API_KEY --body="sk-ant-..."
```

### Step 3: Configure Environment Secrets

```bash
# Via GitHub UI
1. Go to Settings → Environments
2. Click "staging" (or create new environment)
3. Scroll to "Environment secrets"
4. Click "Add secret"
5. Name: STAGING_DATABASE_URL
6. Secret: <paste connection string>
7. Click "Add secret"
```

**Via GitHub CLI:**
```bash
# Staging secrets
gh secret set STAGING_DATABASE_URL --env staging --body="mongodb://..."

# Production secrets
gh secret set PRODUCTION_DATABASE_URL --env production --body="mongodb+srv://..."
gh secret set PAGERDUTY_TOKEN --env production --body="R01234..."
```

### Step 4: Verify Secrets Are Set

```bash
# List repository secrets
gh secret list

# List environment secrets
gh secret list --env staging
gh secret list --env production
```

**Expected output:**
```
ANTHROPIC_API_KEY   Updated 2025-10-18
CODECOV_TOKEN       Updated 2025-10-18
MONITORING_API_KEY  Updated 2025-10-18
OPENAI_API_KEY      Updated 2025-10-18
SLACK_WEBHOOK       Updated 2025-10-18
```

---

## Security Best Practices

### Secret Rotation

| Secret | Rotation Frequency | Process |
|--------|-------------------|---------|
| OPENAI_API_KEY | Every 90 days | Create new key → Update secret → Delete old key |
| ANTHROPIC_API_KEY | Every 90 days | Create new key → Update secret → Delete old key |
| PRODUCTION_DATABASE_URL | Every 6 months | Create new user → Update connection string → Revoke old user |
| PAGERDUTY_TOKEN | Every 12 months | Regenerate integration → Update secret |
| CODECOV_TOKEN | Never (unless compromised) | Regenerate only if leaked |

### Secret Protection

1. **Never commit secrets to repository**
   ```bash
   # Check for accidental commits
   git log -p | grep -i 'sk-proj\|sk-ant\|mongodb://'

   # Use pre-commit hooks to detect secrets
   pre-commit run detect-secrets --all-files
   ```

2. **Use environment-specific secrets**
   - Staging secrets should use test/sandbox accounts
   - Production secrets should have minimal permissions
   - Never use production credentials in staging

3. **Monitor secret usage**
   - Review GitHub Actions logs for secret leaks
   - Enable Slack alerts for secret access
   - Check API provider dashboards for unusual activity

4. **Least privilege principle**
   ```json
   {
     "database_user": "genesis_app",
     "permissions": ["read", "write"],
     "excluded": ["drop_database", "create_user", "modify_permissions"]
   }
   ```

5. **Audit trail**
   - Document when secrets were created/rotated
   - Track who has access to secret values
   - Maintain offline backup of recovery tokens (encrypted)

---

## Validation

### Test Secret Configuration

Run this workflow to validate all secrets are configured correctly:

```bash
# Manual test via GitHub CLI
gh workflow run ci.yml

# Check workflow status
gh run list --workflow=ci.yml --limit 1

# View logs
gh run view --log
```

### Secret Validation Checklist

**Before staging deployment:**
- [ ] CODECOV_TOKEN set (run `gh secret list | grep CODECOV`)
- [ ] SLACK_WEBHOOK set (optional)
- [ ] OPENAI_API_KEY set and valid (test with `curl`)
- [ ] ANTHROPIC_API_KEY set and valid
- [ ] STAGING_DATABASE_URL set (environment secret)

**Before production deployment:**
- [ ] All staging secrets configured ✓
- [ ] PRODUCTION_DATABASE_URL set (environment secret)
- [ ] PRODUCTION_DATABASE_URL uses SSL/TLS
- [ ] PAGERDUTY_TOKEN set (optional but recommended)
- [ ] DOCKER_REGISTRY_TOKEN set (if using private registry)
- [ ] MONITORING_API_KEY set (if using external monitoring)

### Testing Secret Access

Create a test workflow to validate secrets:

```yaml
# .github/workflows/test-secrets.yml
name: Test Secrets
on: workflow_dispatch

jobs:
  test-secrets:
    runs-on: ubuntu-latest
    steps:
      - name: Test repository secrets
        run: |
          echo "CODECOV_TOKEN: ${CODECOV_TOKEN:0:10}..." # Show first 10 chars
          echo "SLACK_WEBHOOK: ${SLACK_WEBHOOK:0:30}..."
          echo "OPENAI_API_KEY: ${OPENAI_API_KEY:0:10}..."
          echo "ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY:0:10}..."
        env:
          CODECOV_TOKEN: ${{ secrets.CODECOV_TOKEN }}
          SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}

      - name: Test API connectivity
        run: |
          # Test OpenAI API
          curl -s https://api.openai.com/v1/models \
            -H "Authorization: Bearer $OPENAI_API_KEY" | grep -q "gpt-4" && echo "✅ OpenAI API works" || echo "❌ OpenAI API failed"

          # Test Anthropic API
          curl -s https://api.anthropic.com/v1/messages \
            -H "x-api-key: $ANTHROPIC_API_KEY" \
            -H "Content-Type: application/json" \
            -d '{"model":"claude-sonnet-4-20250514","max_tokens":10,"messages":[{"role":"user","content":"test"}]}' | grep -q "content" && echo "✅ Anthropic API works" || echo "❌ Anthropic API failed"
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

Run test:
```bash
gh workflow run test-secrets.yml
gh run watch
```

---

## Troubleshooting

### Secret Not Found Error

**Symptom:**
```
Error: Secret CODECOV_TOKEN not found
```

**Fix:**
```bash
# Verify secret exists
gh secret list | grep CODECOV_TOKEN

# If missing, add it
gh secret set CODECOV_TOKEN --body="your-token"
```

### Wrong Environment Secret

**Symptom:**
```
Error: Cannot connect to database - authentication failed
```

**Fix:**
```bash
# Check which environment the workflow is running in
gh run view <run-id>

# Verify correct environment secret is set
gh secret list --env production | grep DATABASE_URL

# Update if needed
gh secret set PRODUCTION_DATABASE_URL --env production --body="mongodb+srv://..."
```

### Expired API Key

**Symptom:**
```
OpenAI API Error: 401 Unauthorized - Invalid API key
```

**Fix:**
```bash
# Generate new API key from provider
# Update secret immediately
gh secret set OPENAI_API_KEY --body="sk-proj-NEW-KEY"

# Verify in next workflow run
gh run rerun <failed-run-id>
```

---

## Appendix

### Secret Priority Matrix

| Secret | Critical | High | Medium | Low |
|--------|----------|------|--------|-----|
| OPENAI_API_KEY | ✓ | | | |
| ANTHROPIC_API_KEY | ✓ | | | |
| PRODUCTION_DATABASE_URL | ✓ | | | |
| CODECOV_TOKEN | | ✓ | | |
| PAGERDUTY_TOKEN | | ✓ | | |
| STAGING_DATABASE_URL | | ✓ | | |
| SLACK_WEBHOOK | | | ✓ | |
| MONITORING_API_KEY | | | ✓ | |
| DOCKER_REGISTRY_TOKEN | | | ✓ | |
| STAGING_API_KEYS | | | | ✓ |
| PRODUCTION_API_KEYS | | | ✓ | |

### External Resources

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [OpenAI API Keys](https://platform.openai.com/api-keys)
- [Anthropic API Keys](https://console.anthropic.com/settings/keys)
- [Codecov Upload Token](https://docs.codecov.com/docs/quick-start)
- [PagerDuty Integration Guide](https://support.pagerduty.com/docs/services-and-integrations)

---

**Next Steps:**

1. Configure all CRITICAL priority secrets immediately
2. Set up HIGH priority secrets before staging deployment
3. Configure MEDIUM priority secrets before production deployment
4. Run secret validation test workflow
5. Document secret rotation schedule in team calendar

**Production Readiness:** Blocked until CRITICAL + HIGH priority secrets configured

---

**Document History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-18 | Cora | Initial secrets documentation |
