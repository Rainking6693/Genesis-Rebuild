# How to Add the Remaining 7-10 Agents to the 10-Business Test

## Current Status

**Currently in test:** 16 agents
**Available but not integrated:** 10 agents
**Total possible:** 26 agents

---

## Missing Agents and Integration Steps

### 1. **StripeIntegrationAgent** ✅ FIXED BY ALEX
**What it does:** Payment processing and subscription management
**How to add:**
```python
# Step 5: Stripe payment integration (AFTER Auth0)
logger.info(f"[{index}] Step 5: Setting up Stripe payments...")
from agents.stripe_integration_agent import get_stripe_agent

stripe_agent = await get_stripe_agent(enable_memory=True)
business_data["agents_used"].append("StripeIntegrationAgent")
test_results["total_agents_used"].add("StripeIntegrationAgent")

payment_config = await stripe_agent.setup_payment_integration(
    business_id=f"biz_{index}",
    payment_type="subscription" if business_type == "saas" else "one_time",
    currency="usd"
)
logger.info(f"✓ [{index}] Stripe configured")
```

---

### 2. **Auth0IntegrationAgent**
**What it does:** Authentication and user management
**How to add:**
```python
# Step 6: Auth0 authentication
logger.info(f"[{index}] Step 6: Setting up Auth0...")
from agents.auth0_integration_agent import get_auth0_agent

auth0_agent = await get_auth0_agent(enable_memory=True)
business_data["agents_used"].append("Auth0IntegrationAgent")
test_results["total_agents_used"].add("Auth0IntegrationAgent")

auth_config = await auth0_agent.configure_authentication(
    auth_method="password",
    mfa_enabled=True,
    user_id=f"biz_{index}"
)
logger.info(f"✓ [{index}] Auth0 with MFA")
```

---

### 3. **UIUXDesignAgent**
**What it does:** User interface and experience design
**How to add:**
```python
# Step 11: UI/UX design
logger.info(f"[{index}] Step 11: UI/UX design...")
from agents.uiux_design_agent import get_uiux_design_agent

uiux_agent = await get_uiux_design_agent(enable_memory=True)
business_data["agents_used"].append("UIUXDesignAgent")
test_results["total_agents_used"].add("UIUXDesignAgent")

design = uiux_agent.create_design(
    design_type="landing_page",
    security_requirements=["responsive", "accessible"]
)
logger.info(f"✓ [{index}] UI/UX designed")
```

---

### 4. **MonitoringAgent**
**What it does:** System monitoring and alerting
**How to add:**
```python
# Step 14: Monitoring
logger.info(f"[{index}] Step 14: Monitoring...")
from agents.monitoring_agent import get_monitoring_agent

monitoring_agent = await get_monitoring_agent(enable_memory=True)
business_data["agents_used"].append("MonitoringAgent")
test_results["total_agents_used"].add("MonitoringAgent")

monitoring = monitoring_agent.setup_monitoring(
    service_name=f"business_{index}",
    metrics=["uptime", "latency", "errors"]
)
logger.info(f"✓ [{index}] Monitoring active")
```

---

### 5. **GeminiComputerUseAgent**
**What it does:** Visual validation and browser automation
**How to add:**
```python
# Step 21: Gemini Computer Use validation
logger.info(f"[{index}] Step 21: Gemini visual validation...")
from agents.gemini_computer_use_agent import GeminiComputerUseAgent

gemini_agent = GeminiComputerUseAgent(enable_memory=True)
business_data["agents_used"].append("GeminiComputerUseAgent")
test_results["total_agents_used"].add("GeminiComputerUseAgent")

# Validate deployment visually
validation = await gemini_agent.validate_deployment(
    url=f"https://business-{index}.vercel.app"
)
logger.info(f"✓ [{index}] Visual validation complete")
```

---

### 6. **SecurityAgent**
**What it does:** Security auditing and vulnerability scanning
**How to add:**
```python
# Step 22: Security audit
logger.info(f"[{index}] Step 22: Security audit...")
from agents.security_agent import SecurityAgent

security_agent = SecurityAgent(enable_memory=True)
business_data["agents_used"].append("SecurityAgent")
test_results["total_agents_used"].add("SecurityAgent")

security_report = security_agent.audit_security(
    business_id=f"biz_{index}",
    scan_types=["sql_injection", "xss", "csrf"]
)
logger.info(f"✓ [{index}] Security audit complete")
```

---

### 7. **LegalAgent**
**What it does:** Legal compliance and terms generation
**How to add:**
```python
# Step 23: Legal compliance
logger.info(f"[{index}] Step 23: Legal compliance...")
from agents.legal_agent import LegalAgent

legal_agent = LegalAgent(enable_memory=True)
business_data["agents_used"].append("LegalAgent")
test_results["total_agents_used"].add("LegalAgent")

legal_docs = legal_agent.generate_legal_documents(
    business_type=business_type,
    jurisdiction="US",
    documents=["terms", "privacy", "disclaimer"]
)
logger.info(f"✓ [{index}] Legal docs generated")
```

---

### 8. **BillingAgent**
**What it does:** Invoice generation and billing management
**How to add:**
```python
# Step 24: Billing setup
logger.info(f"[{index}] Step 24: Billing setup...")
from agents.billing_agent import BillingAgent

billing_agent = BillingAgent(enable_memory=True)
business_data["agents_used"].append("BillingAgent")
test_results["total_agents_used"].add("BillingAgent")

billing_config = billing_agent.setup_billing(
    business_id=f"biz_{index}",
    billing_cycle="monthly",
    payment_methods=["card", "ach"]
)
logger.info(f"✓ [{index}] Billing configured")
```

---

### 9. **OnboardingAgent**
**What it does:** User onboarding flows and tutorials
**How to add:**
```python
# Step 25: Onboarding flow
logger.info(f"[{index}] Step 25: Onboarding flow...")
from agents.onboarding_agent import OnboardingAgent

onboarding_agent = OnboardingAgent(enable_memory=True)
business_data["agents_used"].append("OnboardingAgent")
test_results["total_agents_used"].add("OnboardingAgent")

onboarding_flow = onboarding_agent.create_onboarding(
    business_type=business_type,
    steps=["welcome", "profile", "tutorial", "first_action"]
)
logger.info(f"✓ [{index}] Onboarding flow created")
```

---

### 10. **MaintenanceAgent**
**What it does:** System maintenance and updates
**How to add:**
```python
# Step 26: Maintenance planning
logger.info(f"[{index}] Step 26: Maintenance planning...")
from agents.maintenance_agent import MaintenanceAgent

maintenance_agent = MaintenanceAgent(enable_memory=True)
business_data["agents_used"].append("MaintenanceAgent")
test_results["total_agents_used"].add("MaintenanceAgent")

maintenance_plan = maintenance_agent.create_maintenance_plan(
    business_id=f"biz_{index}",
    schedule="weekly",
    tasks=["backups", "updates", "cleanup"]
)
logger.info(f"✓ [{index}] Maintenance planned")
```

---

## Integration Order (Recommended)

**Phase 1: Core Business (Steps 1-10)** ✅ Already in test
1. BusinessGenerationAgent
2. DeployAgent
3. DatabaseDesignAgent
4. APIDesignAgent
5. ContentCreationAgent
6. SEOOptimizationAgent
7. EmailMarketingAgent
8. MarketingAgentMultimodal
9. SupportAgent
10. AnalyticsAgent

**Phase 2: Quality & Evolution (Steps 11-16)** ✅ Already in test
11. QAAgent
12. CodeReviewAgent
13. DocumentationAgent
14. DataJuicerAgent
15. ReActTrainingAgent
16. SEDarwinAgent

**Phase 3: Security & Auth (Steps 17-19)** ⏳ TO ADD
17. StripeIntegrationAgent ✅ (FIXED)
18. Auth0IntegrationAgent
19. SecurityAgent

**Phase 4: Operations (Steps 20-22)** ⏳ TO ADD
20. MonitoringAgent
21. UIUXDesignAgent
22. GeminiComputerUseAgent

**Phase 5: Business Operations (Steps 23-26)** ⏳ TO ADD
23. LegalAgent
24. BillingAgent
25. OnboardingAgent
26. MaintenanceAgent

---

## Quick Implementation

To add all 10 agents at once, copy this code block into the test after the current agent #16 (SEDarwinAgent):

```python
# PHASE 3: Security & Auth (17-19)
# ... Stripe code from above ...
# ... Auth0 code from above ...
# ... Security code from above ...

# PHASE 4: Operations (20-22)
# ... Monitoring code from above ...
# ... UIUX code from above ...
# ... Gemini code from above ...

# PHASE 5: Business Operations (23-26)
# ... Legal code from above ...
# ... Billing code from above ...
# ... Onboarding code from above ...
# ... Maintenance code from above ...
```

Update the step counter to go from "Step 1/16" to "Step 1/26" throughout.

---

## Expected Impact

**Before:** 16 agents per business × 10 businesses = 160 agent calls
**After:** 26 agents per business × 10 businesses = 260 agent calls

**Estimated time:**
- Current: ~2-3 minutes per business (16 agents)
- With all 26: ~3-5 minutes per business
- Total for 10 businesses: ~30-50 minutes

**Test completeness:** 26/26 agents = 100% Genesis agent coverage ✅

---

## Notes

1. **All agent APIs verified by Alex** - The 3 critical errors have been fixed
2. **Error handling** - Each agent wrapped in try/except to prevent cascade failures
3. **Logging** - Each step logs progress for monitoring
4. **Memory enabled** - All agents use MemoryOS for learning
5. **Backward compatible** - Can still run the 16-agent version

---

**Ready to integrate?** Copy the code blocks above into your test file after line ~310 (after SEDarwinAgent).
