# Quick Start: Production Deployment

**TL;DR:** Feature flag system ready. Deploy in 3 commands.

---

## Option 1: Safe Deployment (RECOMMENDED)

**7-day progressive rollout with auto-rollback**

```bash
# 1. Review configuration
cat config/feature_flags.json

# 2. Deploy
python scripts/deploy.py deploy --strategy safe

# 3. Monitor
watch -n 30 "python scripts/deploy.py status | jq '.current_percentage'"
```

---

## Option 2: Fast Deployment

**3-day rollout for validated changes**

```bash
python scripts/deploy.py deploy --strategy fast
```

---

## Emergency Rollback

**Instant rollback to safe mode**

```bash
# Method 1: Deployment script
python scripts/deploy.py rollback

# Method 2: Config file
vim config/feature_flags.json
# Set "orchestration_enabled": {"enabled": false}

# Restart orchestrator
pkill -f genesis_orchestrator.py && python genesis_orchestrator.py &
```

**Rollback time:** <15 minutes (typically <5 minutes)

---

## Monitoring Commands

```bash
# Deployment status
python scripts/deploy.py status

# Feature flags status
python -c "from infrastructure.feature_flags import get_feature_flag_manager; \
    print(get_feature_flag_manager().get_all_flags())"

# Orchestrator test
python genesis_orchestrator.py

# Check logs
tail -f logs/production.log
```

---

## Key Files

- `infrastructure/feature_flags.py` - Feature flag system
- `scripts/deploy.py` - Deployment automation
- `config/feature_flags.json` - Flag configuration
- `config/production.env.example` - Environment template
- `docs/PRODUCTION_DEPLOYMENT_READY.md` - Full documentation (630 lines)
- `FEATURE_FLAG_DEPLOYMENT_SUMMARY.md` - Complete summary

---

## Success Criteria

Deployment is successful if:
- ✅ Phase 4 reaches 100% without rollback
- ✅ Error rate <1% for 48 hours
- ✅ P95 latency improved by 30%+
- ✅ Cost savings ~48% visible in LLM bills

---

**Need help?** Read `docs/PRODUCTION_DEPLOYMENT_READY.md`
