# API Contracts System - Quick Start Guide

**For Staging Deployment in 5 Minutes**

## Prerequisites Check

```bash
# 1. Verify Python 3.12+
python --version

# 2. Verify Redis running
redis-cli ping
# Expected: PONG

# 3. Install dependencies
pip install -r requirements_infrastructure.txt
```

## Deploy to Staging (3 commands)

```bash
# 1. Make script executable
chmod +x scripts/deploy_api_contracts_staging.sh

# 2. Run deployment (no arguments for standard deploy)
bash scripts/deploy_api_contracts_staging.sh

# 3. Verify success
curl http://localhost:8000/health
```

**Expected Output:**
```json
{
  "status": "healthy",
  "components": {
    "api_validator": "operational",
    "redis": "operational",
    "schemas": "loaded"
  }
}
```

## Run Tests

```bash
# Run all API Contracts staging tests
pytest tests/test_api_contracts_staging.py -v

# Run specific test suite
pytest tests/test_api_contracts_staging.py::TestHealthCheck -v
pytest tests/test_api_contracts_staging.py::TestRateLimiting -v
pytest tests/test_api_contracts_staging.py::TestIdempotency -v
```

**Expected:** 30+ tests passing ✅

## Test the API

### Valid Request (should pass validation)
```bash
curl -X POST http://localhost:8000/agents/ask \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000" \
  -d '{"role": "qa", "prompt": "Test question"}'

# Response headers show:
# X-RateLimit-Limit: 100
# X-RateLimit-Remaining: 99
# X-Validation-Time-Ms: 6.2
```

### Rate Limit Test (101st request should get 429)
```bash
# Send 101 requests rapidly
for i in {1..101}; do
  curl -X POST http://localhost:8000/agents/ask \
    -H "Content-Type: application/json" \
    -d '{"role": "qa", "prompt": "Test"}'
done

# Request 101+ returns: HTTP 429 Too Many Requests
```

### Idempotency Test (duplicate returns cached response)
```bash
# First request
curl -X POST http://localhost:8000/agents/ask \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: test-key-123" \
  -d '{"role": "qa", "prompt": "Test"}' \
  -i

# Duplicate request with same Idempotency-Key
# Should return cached response immediately
curl -X POST http://localhost:8000/agents/ask \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: test-key-123" \
  -d '{"role": "qa", "prompt": "Test"}' \
  -i
```

## Monitor

### Check Logs
```bash
# API Contracts logs
tail -f /var/log/genesis/api/api_contracts.log

# Validation errors
tail -f /var/log/genesis/api/validation.log

# Rate limit hits
tail -f /var/log/genesis/api/rate_limit.log
```

### Redis Status
```bash
# Check Redis memory
redis-cli INFO memory

# Check cached specs
redis-cli KEYS "openapi_spec:*"

# Check rate limit buckets
redis-cli KEYS "rate_limit:*"
```

## Troubleshoot

### Redis Connection Error
```bash
# Verify Redis running
ps aux | grep redis-server

# Start Redis if needed
redis-server --port 6379 --daemonize yes

# Test connection
redis-cli ping
```

### Validation Latency High
```bash
# Check Redis performance
redis-cli --latency-history 10

# Profile validator
python -c "
from infrastructure.api_validator import OpenAPIValidator
v = OpenAPIValidator()
import time
start = time.time()
for _ in range(100):
    v.validate_request(...)
print(f'Avg: {(time.time()-start)/100*1000:.1f}ms')
"
```

### Specs Not Loading
```bash
# Verify spec files exist
ls -la api/schemas/

# Check YAML syntax
python -c "import yaml; yaml.safe_load(open('api/schemas/agents_ask.openapi.yaml'))"

# Reload specs
redis-cli FLUSHDB 0  # Clear cache
bash scripts/deploy_api_contracts_staging.sh
```

## Rollback (if needed)

```bash
# Stop current deployment
systemctl stop genesis-api-contracts

# Restore from backup
bash scripts/rollback_api_contracts_staging.sh --backup-id 20251030_160145

# Verify
curl http://localhost:8000/health
```

## Next Steps

1. **Monitor 48 hours** in staging
2. **Review metrics** in Prometheus/Grafana
3. **Validate performance** (<10ms latency)
4. **Confirm zero errors** in error logs
5. **Plan production migration** when ready

## Key Files

| File | Purpose | Lines |
|------|---------|-------|
| `docs/API_CONTRACTS_STAGING_DEPLOYMENT.md` | Full deployment guide | 1,036 |
| `config/api_contracts_staging.yaml` | Staging configuration | 470 |
| `scripts/deploy_api_contracts_staging.sh` | Automated deployment | 659 |
| `tests/test_api_contracts_staging.py` | Validation tests | 650 |

## Support

- **Technical Issues:** Contact Thon (Python Expert)
- **Testing Questions:** Contact Hudson (Code Review)
- **Full Documentation:** See `API_CONTRACTS_STAGING_DEPLOYMENT.md`

---

**Status:** ✅ Ready for Staging Deployment
**Version:** 1.0.0
**Created:** October 30, 2025
