# Rogue Quick Reference Card

**Version:** 0.2.0
**Status:** Operational
**Installation Method:** uvx (no system install needed)

---

## Quick Commands

### Check Installation
```bash
uvx rogue-ai --version
# Output: Rogue AI version: 0.2.0
```

### Start A2A Service
```bash
./scripts/start_a2a_service.sh
# Starts on http://localhost:8000
```

### Run Rogue Tests
```bash
export OPENAI_API_KEY="sk-..."
./scripts/run_rogue_tests.sh
```

### Run Direct (No Scripts)
```bash
uvx rogue-ai cli \
  --config-file rogue_config/rogue_config.yaml \
  --protocol a2a \
  --evaluated-agent-url "http://localhost:8000/a2a"
```

---

## File Locations

| File | Path | Purpose |
|------|------|---------|
| Config | `rogue_config/rogue_config.yaml` | Main configuration |
| Scenarios | `rogue_config/scenarios.json` | Test scenarios (5) |
| Reports | `rogue_config/rogue_report.json` | Test results |
| Start Script | `scripts/start_a2a_service.sh` | A2A service launcher |
| Test Script | `scripts/run_rogue_tests.sh` | Rogue test runner |

---

## Environment Variables

```bash
# Required for LLM judge
export OPENAI_API_KEY="sk-..."

# Optional A2A authentication
export A2A_API_KEY="your-key"

# Genesis environment (development/staging/production)
export GENESIS_ENV="development"
```

---

## Common Tasks

### Add New Scenario
Edit `rogue_config/scenarios.json`:
```json
{
  "id": "scenario_XXX",
  "name": "Test Name",
  "description": "What this tests",
  "input": { "task": "...", "agent": "..." },
  "expected_output": { "type": "success", "contains": [...] },
  "priority": "high",
  "tags": ["category"]
}
```

### View Test Report
```bash
cat rogue_config/rogue_report.json | jq .
```

### Check A2A Service Health
```bash
curl http://localhost:8000/health
curl http://localhost:8000/a2a/card
curl http://localhost:8000/a2a/agents
```

---

## Troubleshooting

### "Port 8000 already in use"
```bash
lsof -i :8000
kill $(lsof -t -i:8000)
```

### "A2A service not running"
```bash
./scripts/start_a2a_service.sh
# Or: uvicorn a2a_service:app --host 0.0.0.0 --port 8000
```

### "Missing API key"
```bash
export OPENAI_API_KEY="sk-..."
export A2A_API_KEY="your-key"
```

---

## Documentation

- **Installation Guide:** `docs/ROGUE_INSTALLATION_GUIDE.md`
- **Installation Summary:** `docs/ROGUE_INSTALLATION_SUMMARY.md`
- **Week 1 Summary:** `docs/ROGUE_WEEK1_SUMMARY.md`
- **Testing Architecture:** `docs/ROGUE_TESTING_ARCHITECTURE.md`
- **Test Scenarios Catalog:** `docs/ROGUE_TEST_SCENARIOS_CATALOG.md`
- **Week 2-3 Implementation:** `docs/ROGUE_IMPLEMENTATION_GUIDE_WEEK2_3.md`

---

## Key Facts

- **Installation:** uvx (no pip install needed)
- **Protocol:** A2A (Agent-to-Agent)
- **Transport:** HTTP
- **Authentication:** API key
- **LLM Judge:** GPT-4
- **Storage:** ~20 MB
- **Conflicts:** None (external tool)
- **Test Pass Rate:** 96.7% (29/30 A2A tests)

---

## Next Steps

1. Build `rogue_runner.py` Python wrapper
2. Expand scenarios to 270 (15 agents × 18 each)
3. Integrate with CI/CD (GitHub Actions)
4. Connect to monitoring (Prometheus/Grafana)

---

**Questions?** See full documentation in `docs/ROGUE_*.md`
