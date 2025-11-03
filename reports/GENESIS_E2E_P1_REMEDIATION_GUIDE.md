# Genesis E2E P1 Remediation Guide

**For:** Codex (Implementation)
**Reviewer:** Hudson
**Timeline:** 2.25 hours
**Priority:** P1 (Required for full E2E mode)

---

## Overview

Your E2E validation work is excellent (8.7/10). The Vercel/Stripe infrastructure you built is production-ready. The gap is in wiring: the deployment code needs to be integrated into GenesisMetaAgent.

**Current State:**
- ✅ VercelClient fully implemented (460 lines)
- ✅ DeploymentValidator fully implemented (412 lines)
- ✅ E2E test framework ready (470 lines)
- ❌ Not wired into GenesisMetaAgent orchestration layer

**Required State:**
- ✅ GenesisMetaAgent can trigger real Vercel deployments
- ✅ Setting RUN_GENESIS_FULL_E2E=true actually works
- ✅ deployment_url propagates through pipeline

---

## P1 Issue #1: Wire Vercel into GenesisMetaAgent

**File:** `infrastructure/genesis_meta_agent.py`
**Time:** 2 hours
**Lines to Modify:** 210-292, 850-855, 1049-1072

### Step 1: Update Constructor (Lines 210-292)

**Current:**
```python
def __init__(
    self,
    mongodb_uri: str = None,
    enable_safety: bool = True,
    enable_memory: bool = True,
    enable_cost_optimization: bool = True,
    autonomous: bool = True,
    enable_a2a: bool = None,
    a2a_service_url: str = None
):
    # ... initialization ...
```

**Add:**
```python
def __init__(
    self,
    mongodb_uri: str = None,
    enable_safety: bool = True,
    enable_memory: bool = True,
    enable_cost_optimization: bool = True,
    autonomous: bool = True,
    enable_a2a: bool = None,
    a2a_service_url: str = None,
    # NEW: Deployment parameters
    enable_vercel_deployment: bool = None,
    vercel_token: str = None,
    vercel_team_id: str = None,
    stripe_secret_key: str = None
):
    # ... existing initialization ...

    # Initialize deployment clients
    if enable_vercel_deployment is None:
        enable_vercel_deployment = os.getenv("RUN_GENESIS_FULL_E2E", "false").lower() == "true"

    self.enable_vercel_deployment = enable_vercel_deployment
    self.vercel_client = None
    self.deployment_validator = None

    if self.enable_vercel_deployment:
        try:
            from infrastructure.execution.vercel_client import VercelClient
            from infrastructure.execution.deployment_validator import DeploymentValidator

            vercel_token = vercel_token or os.getenv("VERCEL_TOKEN")
            vercel_team_id = vercel_team_id or os.getenv("VERCEL_TEAM_ID")

            if not vercel_token:
                logger.warning("Vercel deployment enabled but VERCEL_TOKEN not set")
                self.enable_vercel_deployment = False
            elif not vercel_team_id:
                logger.warning("Vercel deployment enabled but VERCEL_TEAM_ID not set")
                self.enable_vercel_deployment = False
            else:
                self.vercel_client = VercelClient(
                    token=vercel_token,
                    team_id=vercel_team_id
                )
                self.deployment_validator = DeploymentValidator()
                logger.info("Vercel deployment client initialized")

        except ImportError as exc:
            logger.warning(f"Failed to import deployment clients: {exc}")
            self.enable_vercel_deployment = False
        except Exception as exc:
            logger.error(f"Failed to initialize deployment clients: {exc}")
            self.enable_vercel_deployment = False

    logger.info(f"  - Vercel Deployment: {'Enabled' if self.enable_vercel_deployment else 'Disabled (simulated)'}")
```

### Step 2: Create Deployment Execution Method (NEW)

**Add after line 1072:**
```python
async def _execute_deployment_task(
    self,
    task: Task,
    agent: str,
    business_type: str,
    business_name: str
) -> Dict[str, Any]:
    """
    Execute deployment task with real Vercel integration.

    Args:
        task: Deployment task to execute
        agent: Agent executing the task (typically deploy_agent)
        business_type: Type of business being deployed
        business_name: Name of the business

    Returns:
        Dict with execution result including deployment_url
    """
    if not self.vercel_client or not self.deployment_validator:
        logger.warning("Vercel client not available, falling back to simulation")
        return await self._simulate_task_execution(task, agent)

    try:
        # Step 1: Create Vercel project
        logger.info(f"Creating Vercel project for {business_name}...")

        # Sanitize project name (lowercase, alphanumeric, hyphens)
        project_name = business_name.lower().replace(" ", "-")
        project_name = "".join(c for c in project_name if c.isalnum() or c == "-")
        project_name = project_name[:63]  # Vercel limit

        # Determine framework based on business type
        framework_map = {
            "saas_tool": "nextjs",
            "content_website": "nextjs",
            "ecommerce_store": "nextjs",
            "marketplace": "nextjs",
            "automation_service": "python",
            "data_product": "python",
            "community_platform": "nextjs",
            "api_service": "python",
            "newsletter": "nextjs",
            "course_platform": "nextjs"
        }
        framework = framework_map.get(business_type, "nextjs")

        # Create project
        project = await self.vercel_client.create_project(
            name=project_name,
            framework=framework
        )
        logger.info(f"Created Vercel project: {project.id}")

        # Step 2: Trigger deployment
        logger.info(f"Triggering deployment for project {project_name}...")

        deployment = await self.vercel_client.create_deployment(
            project_name=project_name,
            target="production"
        )
        logger.info(f"Created deployment: {deployment.id}")

        # Step 3: Wait for deployment to complete
        logger.info(f"Waiting for deployment {deployment.id} to complete...")

        deployment_url = await self.vercel_client.wait_for_deployment(
            deployment_id=deployment.id,
            timeout_seconds=300,  # 5 minutes
            poll_interval=10
        )
        logger.info(f"Deployment ready: {deployment_url}")

        # Step 4: Validate deployment
        logger.info(f"Validating deployment at {deployment_url}...")

        validation_report = await self.deployment_validator.validate_full_deployment(
            deployment_url=deployment_url,
            business_type=business_type,
            max_response_time=5.0
        )

        if validation_report.success:
            logger.info(f"Deployment validation passed: {validation_report.pass_rate:.1f}%")
        else:
            logger.warning(
                f"Deployment validation failed: {validation_report.passed_checks}/{validation_report.total_checks} checks passed"
            )

        # Return result with deployment_url
        return {
            "task_id": task.task_id,
            "agent": agent,
            "status": "completed" if validation_report.success else "completed_with_warnings",
            "description": task.description,
            "result": f"Successfully deployed to Vercel: {deployment_url}",
            "deployment_url": deployment_url,  # KEY: This is what E2E test expects
            "vercel_project_id": project.id,
            "vercel_deployment_id": deployment.id,
            "validation_report": {
                "success": validation_report.success,
                "pass_rate": validation_report.pass_rate,
                "total_checks": validation_report.total_checks,
                "passed_checks": validation_report.passed_checks
            },
            "timestamp": datetime.now().isoformat(),
            "via_vercel": True
        }

    except Exception as exc:
        logger.error(f"Vercel deployment failed: {exc}")
        return {
            "task_id": task.task_id,
            "agent": agent,
            "status": "failed",
            "description": task.description,
            "result": f"Deployment failed: {str(exc)}",
            "error": str(exc),
            "timestamp": datetime.now().isoformat(),
            "via_vercel": True
        }
```

### Step 3: Wire into Task Execution (Line 850-855)

**Current:**
```python
# Execute task (via A2A if enabled, otherwise simulated)
logger.debug(f"Executing task: {task_id} with agent: {agent}")
result = await self._execute_task_real_or_simulated(task, agent)
results.append(result)
```

**Replace with:**
```python
# Execute task
logger.debug(f"Executing task: {task_id} with agent: {agent}")

# Check if this is a deployment task and Vercel is enabled
if (task.description and "deploy" in task.description.lower() and
    self.enable_vercel_deployment and
    hasattr(self, '_current_business_context')):
    # Execute real deployment
    result = await self._execute_deployment_task(
        task=task,
        agent=agent,
        business_type=self._current_business_context.get("business_type", "general"),
        business_name=self._current_business_context.get("business_name", f"business-{task.task_id[:8]}")
    )
else:
    # Execute via A2A or simulation
    result = await self._execute_task_real_or_simulated(task, agent)

results.append(result)
```

### Step 4: Store Business Context (Line 324-334)

**Add after line 334:**
```python
# Store business context for deployment tasks
self._current_business_context = {
    "business_type": business_type,
    "business_name": requirements.name if requirements else f"business-{business_id[:8]}",
    "business_id": business_id
}
```

### Step 5: Update Deployment URL Extraction (Line 1116-1134)

**Current:**
```python
def _extract_deployment_url(self, results: List[Dict[str, Any]]) -> Optional[str]:
    for result in results:
        if "deployment_url" in result:
            return result["deployment_url"]
        if "url" in result:
            return result["url"]

    # Generate placeholder URL for testing
    # In production, this will come from actual deployment tasks
    return None
```

**Replace with:**
```python
def _extract_deployment_url(self, results: List[Dict[str, Any]]) -> Optional[str]:
    """
    Extract deployment URL from task results.

    Args:
        results: List of task execution results

    Returns:
        Deployment URL if found, placeholder for simulation, None for failures
    """
    # Check for real deployment URL
    for result in results:
        if "deployment_url" in result:
            return result["deployment_url"]
        if "url" in result:
            return result["url"]

    # In simulation mode, return placeholder URL for testing
    if not self.enable_vercel_deployment and hasattr(self, '_current_business_context'):
        business_id = self._current_business_context.get("business_id", "unknown")
        return f"https://simulated-{business_id[:8]}.vercel.app"

    # No deployment URL found
    return None
```

---

## P1 Issue #2: Add Environment Variable Validation

**File:** `tests/e2e/test_autonomous_business_creation.py`
**Time:** 15 minutes
**Lines to Modify:** 381-385

### Step 1: Add Validation After run_full Check

**Current:**
```python
if not e2e_context.run_full:
    pytest.skip(
        "Full autonomous deployment tests disabled. "
        "Set RUN_GENESIS_FULL_E2E=true (with Vercel/Stripe credentials) to execute."
    )
```

**Replace with:**
```python
if not e2e_context.run_full:
    pytest.skip(
        "Full autonomous deployment tests disabled. "
        "Set RUN_GENESIS_FULL_E2E=true (with Vercel/Stripe credentials) to execute."
    )

# Validate credentials when full mode enabled
if not e2e_context.has_vercel_credentials:
    pytest.fail(
        "RUN_GENESIS_FULL_E2E=true requires VERCEL_TOKEN and VERCEL_TEAM_ID environment variables.\n\n"
        "Setup Instructions:\n"
        "1. Visit https://vercel.com/account/tokens\n"
        "2. Create new token with deployment permissions\n"
        "3. Export VERCEL_TOKEN='your-token-here'\n"
        "4. Get team ID from https://vercel.com/teams/settings\n"
        "5. Export VERCEL_TEAM_ID='your-team-id'\n"
        "6. Re-run test with credentials set"
    )
```

---

## Testing Your Changes

### Step 1: Test Simulation Mode (Should Still Work)
```bash
# Should pass without Vercel credentials
pytest tests/e2e/test_autonomous_business_creation.py::test_autonomous_business_creation_simulation -v
```

**Expected:** ✅ PASSED (deployment_url should be placeholder)

### Step 2: Test Full Mode Validation (Should Fail Fast)
```bash
# Should fail with clear error message (no credentials)
RUN_GENESIS_FULL_E2E=true pytest tests/e2e/test_autonomous_business_creation.py::test_autonomous_business_creation -v
```

**Expected:** ❌ FAILED with message "requires VERCEL_TOKEN and VERCEL_TEAM_ID"

### Step 3: Test Full Mode with Credentials (Should Deploy)
```bash
# Should actually deploy to Vercel
export VERCEL_TOKEN="your-token"
export VERCEL_TEAM_ID="your-team-id"
RUN_GENESIS_FULL_E2E=true pytest tests/e2e/test_autonomous_business_creation.py::test_autonomous_business_creation -v
```

**Expected:** ✅ PASSED (with real deployment_url from Vercel)

### Step 4: Verify Deployment URL Propagation
```bash
# Check that deployment_url is captured
python -c "
import asyncio
from infrastructure.genesis_meta_agent import GenesisMetaAgent
from tests.e2e.test_autonomous_business_creation import BusinessRequirements

async def test():
    meta_agent = GenesisMetaAgent(enable_vercel_deployment=False)
    result = await meta_agent.create_business(
        business_type='saas_tool',
        requirements=BusinessRequirements(
            name='Test SaaS',
            description='Test description',
            target_audience='Developers',
            monetization='Freemium',
            mvp_features=['Feature 1'],
            tech_stack=['Next.js'],
            success_metrics={'metric': 'value'}
        )
    )
    print(f'deployment_url: {result.deployment_url}')
    assert result.deployment_url is not None, 'Expected placeholder URL in simulation'
    assert result.deployment_url.startswith('https://simulated-'), f'Got: {result.deployment_url}'
    print('✅ Deployment URL propagation working')

asyncio.run(test())
"
```

**Expected:** ✅ Deployment URL propagation working

---

## Integration Test (Optional but Recommended)

**Create:** `tests/integration/test_genesis_vercel_integration.py`

```python
"""Integration tests for Genesis Meta-Agent → Vercel deployment."""

import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from infrastructure.genesis_meta_agent import GenesisMetaAgent, BusinessRequirements
from infrastructure.execution.vercel_client import VercelProject, VercelDeployment
from infrastructure.execution.deployment_validator import ValidationReport, ValidationResult


@pytest.mark.asyncio
async def test_genesis_deploys_to_vercel_when_enabled():
    """Test that meta-agent triggers Vercel deployment when enabled."""

    # Mock Vercel client
    with patch("infrastructure.genesis_meta_agent.VercelClient") as mock_vercel_class:
        mock_vercel = AsyncMock()
        mock_vercel_class.return_value = mock_vercel

        # Mock create_project
        mock_vercel.create_project.return_value = VercelProject(
            id="proj_123",
            name="test-saas",
            framework="nextjs",
            created_at=None
        )

        # Mock create_deployment
        mock_vercel.create_deployment.return_value = VercelDeployment(
            id="dpl_456",
            url="test-saas-abc123.vercel.app",
            state="BUILDING",
            created_at=None,
            project_id="proj_123"
        )

        # Mock wait_for_deployment
        mock_vercel.wait_for_deployment.return_value = "https://test-saas-abc123.vercel.app"

        # Mock deployment validator
        with patch("infrastructure.genesis_meta_agent.DeploymentValidator") as mock_validator_class:
            mock_validator = AsyncMock()
            mock_validator_class.return_value = mock_validator

            mock_validator.validate_full_deployment.return_value = ValidationReport(
                success=True,
                deployment_url="https://test-saas-abc123.vercel.app",
                results=[
                    ValidationResult(check="HTTP Status", passed=True, details="200"),
                    ValidationResult(check="Response Time", passed=True, details="0.5s"),
                ]
            )

            # Initialize meta-agent with Vercel enabled
            meta_agent = GenesisMetaAgent(
                enable_vercel_deployment=True,
                vercel_token="test-token",
                vercel_team_id="test-team"
            )

            # Create business
            result = await meta_agent.create_business(
                business_type="saas_tool",
                requirements=BusinessRequirements(
                    name="Test SaaS",
                    description="Test SaaS tool",
                    target_audience="Developers",
                    monetization="Freemium",
                    mvp_features=["Feature 1"],
                    tech_stack=["Next.js"],
                    success_metrics={"metric": "value"}
                )
            )

            # Assertions
            assert result.success, "Business creation should succeed"
            assert result.deployment_url is not None, "Should have deployment URL"
            assert result.deployment_url.startswith("https://"), f"Invalid URL: {result.deployment_url}"

            # Verify Vercel methods were called
            mock_vercel.create_project.assert_called_once()
            mock_vercel.create_deployment.assert_called_once()
            mock_vercel.wait_for_deployment.assert_called_once()
            mock_validator.validate_full_deployment.assert_called_once()


@pytest.mark.asyncio
async def test_genesis_falls_back_to_simulation_when_vercel_disabled():
    """Test that meta-agent uses simulation when Vercel is disabled."""

    meta_agent = GenesisMetaAgent(enable_vercel_deployment=False)

    result = await meta_agent.create_business(
        business_type="saas_tool",
        requirements=BusinessRequirements(
            name="Test SaaS",
            description="Test SaaS tool",
            target_audience="Developers",
            monetization="Freemium",
            mvp_features=["Feature 1"],
            tech_stack=["Next.js"],
            success_metrics={"metric": "value"}
        )
    )

    assert result.success, "Business creation should succeed in simulation"
    assert result.deployment_url is not None, "Should have placeholder URL"
    assert result.deployment_url.startswith("https://simulated-"), f"Expected simulated URL, got: {result.deployment_url}"
```

**Run:**
```bash
pytest tests/integration/test_genesis_vercel_integration.py -v
```

**Expected:** ✅ 2/2 tests passing

---

## Checklist

Before requesting re-audit:

- [ ] Updated GenesisMetaAgent constructor (Step 1)
- [ ] Created _execute_deployment_task method (Step 2)
- [ ] Wired deployment into _execute_tasks (Step 3)
- [ ] Stored business context (Step 4)
- [ ] Updated _extract_deployment_url (Step 5)
- [ ] Added environment variable validation (P1 Issue #2)
- [ ] Tested simulation mode (still works)
- [ ] Tested full mode validation (fails fast with clear error)
- [ ] (Optional) Tested with real Vercel credentials
- [ ] (Optional) Created integration tests

---

## Timeline Estimate

| Task | Time | Status |
|------|------|--------|
| Update constructor | 30 min | ⏳ |
| Create deployment method | 60 min | ⏳ |
| Wire into execution | 15 min | ⏳ |
| Update URL extraction | 10 min | ⏳ |
| Add env validation | 15 min | ⏳ |
| Test changes | 30 min | ⏳ |
| **TOTAL** | **2.5 hours** | ⏳ |

---

## Questions?

**Unclear about implementation?** Ask Hudson for clarification.

**Need help with testing?** Alex can provide E2E validation.

**Ready for re-audit?** Tag Hudson when changes complete.

---

**Hudson's Note:**
Your infrastructure code is excellent. This is just wiring—connecting existing pieces together. You've done the hard work already. This is the easy part. 💪

---

**END OF REMEDIATION GUIDE**
