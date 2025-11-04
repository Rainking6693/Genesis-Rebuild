# THON INSTRUCTIONS: Business Execution Engine
**Assignment Date:** November 3, 2025
**Agent:** Thon (Infrastructure & Deployment Specialist)
**Timeline:** 10 hours
**Priority:** CRITICAL
**Tools:** Context7 MCP + Haiku 4.5 where possible

---

## 🎯 MISSION

Build the Business Execution Engine - the system that takes Genesis Meta-Agent plans and executes them into live, deployed, revenue-generating websites on Vercel.

**Context:** This is the **EXECUTION LAYER** of Genesis. Cora creates the plan, you make it real.

---

## 🔑 CREDENTIALS PROVIDED

```bash
# Vercel Deployment
VERCEL_TOKEN=qRbJRorD2kfr8A2lrs9aYA9Y
VERCEL_TEAM_ID=team_RWhuisUTeew8ZnTctqTZSyfF

# Already in .env
GITHUB_TOKEN=<will use existing or create new repos under Genesis org>
MONGODB_URI=mongodb://localhost:27017
STRIPE_API_KEY=<will be provided for payment integration>
```

---

## 📋 TASKS

### Task 1: Business Executor Core (5 hours)

**Goal:** Build the execution engine that deploys complete businesses to Vercel.

**Files to Create:**

#### 1. `infrastructure/execution/business_executor.py` (500 lines)
```python
"""
Business Execution Engine

Takes business plans from Genesis Meta-Agent and executes them:
1. Generate code (using Builder agent)
2. Create GitHub repo
3. Deploy to Vercel
4. Configure domain & SSL
5. Set up monitoring
6. Validate deployment
"""

import asyncio
import subprocess
from typing import Dict, Any, List, Optional
from dataclasses import dataclass

@dataclass
class BusinessExecutionConfig:
    """Configuration for business execution."""
    vercel_token: str
    vercel_team_id: str
    github_token: str
    mongodb_uri: str
    enable_monitoring: bool = True
    enable_analytics: bool = True

class BusinessExecutor:
    """
    Execute business creation and deployment.

    Workflow:
    1. Generate code (via Builder agent)
    2. Create GitHub repository
    3. Initialize Next.js project
    4. Deploy to Vercel
    5. Configure custom domain (optional)
    6. Set up health checks
    7. Enable error tracking (Sentry/OTEL)
    8. Validate deployment
    """

    def __init__(self, config: BusinessExecutionConfig):
        """Initialize Business Executor with credentials."""
        self.config = config
        self.vercel_client = VercelClient(
            token=config.vercel_token,
            team_id=config.vercel_team_id
        )
        self.github_client = GitHubClient(token=config.github_token)

    async def execute_business(
        self,
        business_plan: Dict[str, Any],
        team: List[Agent]
    ) -> BusinessExecutionResult:
        """
        Execute full business creation and deployment.

        Args:
            business_plan: Plan from Genesis Meta-Agent
                {
                    "name": "AI Writing Assistant",
                    "description": "...",
                    "tech_stack": ["Next.js", "OpenAI", "Stripe"],
                    "mvp_features": ["Feature 1", "Feature 2"],
                    "tasks": [Task1, Task2, ...]
                }
            team: Agent team from Swarm Optimizer

        Returns:
            BusinessExecutionResult with deployment_url, repo_url, metrics
        """
        try:
            # Step 1: Generate code (via Builder agent)
            code_result = await self._generate_code(business_plan, team)

            # Step 2: Create GitHub repository
            repo_url = await self._create_github_repo(
                name=self._sanitize_repo_name(business_plan["name"]),
                description=business_plan["description"],
                code=code_result["code"]
            )

            # Step 3: Deploy to Vercel
            deployment = await self._deploy_to_vercel(
                repo_url=repo_url,
                project_name=self._sanitize_project_name(business_plan["name"]),
                env_vars=self._prepare_env_vars(business_plan)
            )

            # Step 4: Configure domain (if provided)
            if business_plan.get("custom_domain"):
                await self._configure_domain(
                    project_id=deployment["project_id"],
                    domain=business_plan["custom_domain"]
                )

            # Step 5: Set up monitoring
            if self.config.enable_monitoring:
                await self._setup_monitoring(
                    deployment_url=deployment["url"],
                    project_name=business_plan["name"]
                )

            # Step 6: Validate deployment
            validation = await self._validate_deployment(deployment["url"])

            return BusinessExecutionResult(
                success=validation.success,
                deployment_url=deployment["url"],
                repo_url=repo_url,
                project_id=deployment["project_id"],
                validation_results=validation.results,
                execution_time_seconds=time.time() - start_time
            )

        except Exception as e:
            logger.error(f"Business execution failed: {e}")
            return BusinessExecutionResult(
                success=False,
                error=str(e),
                execution_time_seconds=time.time() - start_time
            )

    async def _generate_code(
        self,
        business_plan: Dict[str, Any],
        team: List[Agent]
    ) -> Dict[str, Any]:
        """
        Generate complete codebase using Builder agent.

        Returns:
            {
                "code": {
                    "src/app/page.tsx": "...",
                    "src/components/...": "...",
                    "package.json": "...",
                    # ... full Next.js project structure
                },
                "tech_stack": ["Next.js", "TypeScript", ...],
                "dependencies": {"next": "14.0.0", ...}
            }
        """
        builder_agent = self._find_agent_by_type(team, "Builder")

        prompt = f"""
        Generate a complete Next.js 14 project for this business:

        Name: {business_plan["name"]}
        Description: {business_plan["description"]}
        Features: {json.dumps(business_plan["mvp_features"])}
        Tech Stack: {json.dumps(business_plan["tech_stack"])}

        Requirements:
        - Next.js 14 with App Router
        - TypeScript
        - Tailwind CSS
        - Responsive design (mobile-first)
        - Production-ready (error handling, loading states)
        - SEO optimized
        - Vercel deployment ready

        Return complete file structure as JSON:
        {{
            "files": {{
                "src/app/page.tsx": "...",
                "src/app/layout.tsx": "...",
                "package.json": "...",
                # ... all files
            }}
        }}
        """

        code_result = await builder_agent.execute(
            task=Task(
                type="generate_code",
                description=prompt,
                context=business_plan
            )
        )

        return code_result

    async def _create_github_repo(
        self,
        name: str,
        description: str,
        code: Dict[str, str]
    ) -> str:
        """
        Create GitHub repository and push code.

        Returns:
            Repository URL (e.g., https://github.com/genesis-org/ai-writing-assistant)
        """
        # Create repo via GitHub API
        repo = await self.github_client.create_repo(
            name=name,
            description=description,
            private=False,  # Public for demo purposes
            auto_init=False
        )

        # Clone repo locally
        temp_dir = f"/tmp/genesis_{name}_{uuid.uuid4()}"
        subprocess.run(["git", "clone", repo["clone_url"], temp_dir], check=True)

        # Write code files
        for file_path, content in code.items():
            full_path = os.path.join(temp_dir, file_path)
            os.makedirs(os.path.dirname(full_path), exist_ok=True)
            with open(full_path, "w") as f:
                f.write(content)

        # Commit and push
        subprocess.run(["git", "add", "."], cwd=temp_dir, check=True)
        subprocess.run(
            ["git", "commit", "-m", "Initial commit: Genesis autonomous creation"],
            cwd=temp_dir,
            check=True
        )
        subprocess.run(["git", "push", "origin", "main"], cwd=temp_dir, check=True)

        # Cleanup
        subprocess.run(["rm", "-rf", temp_dir], check=True)

        return repo["html_url"]

    async def _deploy_to_vercel(
        self,
        repo_url: str,
        project_name: str,
        env_vars: Dict[str, str]
    ) -> Dict[str, Any]:
        """
        Deploy GitHub repo to Vercel.

        Returns:
            {
                "url": "https://ai-writing-assistant.vercel.app",
                "project_id": "prj_...",
                "deployment_id": "dpl_..."
            }
        """
        # Create Vercel project
        project = await self.vercel_client.create_project(
            name=project_name,
            git_repository={
                "type": "github",
                "repo": self._extract_repo_path(repo_url)
            },
            framework="nextjs",
            environment_variables=[
                {"key": k, "value": v, "target": ["production"]}
                for k, v in env_vars.items()
            ]
        )

        # Trigger deployment
        deployment = await self.vercel_client.create_deployment(
            project_id=project["id"],
            target="production"
        )

        # Wait for deployment to complete (with timeout)
        deployment_url = await self._wait_for_deployment(
            deployment_id=deployment["id"],
            timeout_seconds=300  # 5 minutes
        )

        return {
            "url": deployment_url,
            "project_id": project["id"],
            "deployment_id": deployment["id"]
        }

    async def _validate_deployment(self, deployment_url: str) -> DeploymentValidation:
        """
        Validate deployment is live and functional.

        Checks:
        1. HTTP 200 response
        2. Page loads (HTML content)
        3. No JavaScript errors (optional)
        4. SSL certificate valid
        5. Response time < 2 seconds
        """
        validation_results = []

        # Check 1: HTTP 200
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(deployment_url, timeout=10.0)
                validation_results.append({
                    "check": "HTTP status",
                    "passed": response.status_code == 200,
                    "details": f"Status: {response.status_code}"
                })

                # Check 2: HTML content
                validation_results.append({
                    "check": "Content present",
                    "passed": len(response.text) > 100,
                    "details": f"Content length: {len(response.text)} bytes"
                })

                # Check 3: Response time
                validation_results.append({
                    "check": "Response time",
                    "passed": response.elapsed.total_seconds() < 2.0,
                    "details": f"Time: {response.elapsed.total_seconds():.2f}s"
                })

        except Exception as e:
            validation_results.append({
                "check": "HTTP request",
                "passed": False,
                "details": str(e)
            })

        # Check 4: SSL certificate
        try:
            ssl_valid = await self._check_ssl_certificate(deployment_url)
            validation_results.append({
                "check": "SSL certificate",
                "passed": ssl_valid,
                "details": "Valid" if ssl_valid else "Invalid"
            })
        except Exception as e:
            validation_results.append({
                "check": "SSL certificate",
                "passed": False,
                "details": str(e)
            })

        return DeploymentValidation(
            success=all(r["passed"] for r in validation_results),
            results=validation_results
        )

    def _prepare_env_vars(self, business_plan: Dict[str, Any]) -> Dict[str, str]:
        """
        Prepare environment variables for deployment.

        Auto-configure:
        - Database URLs (MongoDB, Redis)
        - API keys (OpenAI, Stripe, etc.)
        - Feature flags
        """
        env_vars = {}

        # Database configuration
        if "database" in business_plan.get("tech_stack", []):
            env_vars["DATABASE_URL"] = self.config.mongodb_uri

        # API keys (based on tech stack)
        tech_stack = [t.lower() for t in business_plan.get("tech_stack", [])]

        if "openai" in tech_stack:
            env_vars["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

        if "stripe" in tech_stack:
            env_vars["STRIPE_API_KEY"] = os.getenv("STRIPE_API_KEY")

        if "anthropic" in tech_stack:
            env_vars["ANTHROPIC_API_KEY"] = os.getenv("ANTHROPIC_API_KEY")

        # Genesis metadata
        env_vars["GENESIS_CREATED"] = "true"
        env_vars["GENESIS_VERSION"] = "1.0"
        env_vars["BUSINESS_TYPE"] = business_plan.get("type", "unknown")

        return env_vars
```

**Key Features:**
- Complete Next.js code generation (via Builder agent)
- GitHub repo creation and code push
- Vercel deployment automation
- Environment variable configuration
- SSL certificate validation
- Health check monitoring
- Error tracking setup

---

#### 2. `infrastructure/execution/deployment_validator.py` (200 lines)
```python
"""
Deployment Validation & Health Checks

Validate deployments are live and functional.
Implement rollback on failures.
"""

class DeploymentValidator:
    """
    Validate deployment health and functionality.
    """

    async def validate_full_deployment(
        self,
        deployment_url: str,
        business_type: str
    ) -> ValidationReport:
        """
        Run comprehensive deployment validation suite.

        Checks:
        1. HTTP 200 response
        2. Page loads (HTML content)
        3. JavaScript loads (if applicable)
        4. API endpoints functional (if applicable)
        5. SSL certificate valid
        6. Response time < 2s
        7. No console errors (if possible)
        8. SEO metadata present
        """
        pass

    async def continuous_health_check(
        self,
        deployment_url: str,
        check_interval_seconds: int = 60
    ):
        """
        Continuous health checking (runs in background).

        Alerts if:
        - HTTP status != 200
        - Response time > 5s
        - Error rate > 5%
        """
        pass

    async def rollback_deployment(
        self,
        project_id: str,
        reason: str
    ):
        """
        Rollback to previous deployment on failure.

        Vercel API: POST /v13/deployments/{deploymentId}/rollback
        """
        pass
```

---

### Task 2: Vercel & GitHub Clients (3 hours)

**Goal:** Build API clients for Vercel and GitHub automation.

**Files to Create:**

#### 1. `infrastructure/execution/vercel_client.py` (300 lines)
```python
"""
Vercel API Client

Wrapper for Vercel REST API:
- Create projects
- Deploy from GitHub
- Configure domains
- Manage environment variables
"""

import httpx
from typing import Dict, Any, List

class VercelClient:
    """
    Vercel REST API client.

    Documentation: https://vercel.com/docs/rest-api
    """

    def __init__(self, token: str, team_id: str):
        """Initialize with Vercel credentials."""
        self.token = token
        self.team_id = team_id
        self.base_url = "https://api.vercel.com"
        self.headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

    async def create_project(
        self,
        name: str,
        git_repository: Dict[str, Any],
        framework: str = "nextjs",
        environment_variables: List[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Create Vercel project.

        POST /v9/projects
        """
        payload = {
            "name": name,
            "gitRepository": git_repository,
            "framework": framework,
            "environmentVariables": environment_variables or []
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/v9/projects?teamId={self.team_id}",
                headers=self.headers,
                json=payload,
                timeout=30.0
            )
            response.raise_for_status()
            return response.json()

    async def create_deployment(
        self,
        project_id: str,
        target: str = "production"
    ) -> Dict[str, Any]:
        """
        Trigger new deployment.

        POST /v13/deployments
        """
        pass

    async def get_deployment_status(self, deployment_id: str) -> Dict[str, Any]:
        """
        Get deployment status.

        GET /v13/deployments/{deploymentId}
        """
        pass

    async def configure_domain(
        self,
        project_id: str,
        domain: str
    ) -> Dict[str, Any]:
        """
        Add custom domain to project.

        POST /v10/projects/{projectId}/domains
        """
        pass
```

---

#### 2. `infrastructure/execution/github_client.py` (200 lines)
```python
"""
GitHub API Client

Wrapper for GitHub REST API:
- Create repositories
- Push code
- Configure webhooks
"""

class GitHubClient:
    """
    GitHub REST API client.

    Documentation: https://docs.github.com/en/rest
    """

    def __init__(self, token: str, org: str = "genesis-autonomous"):
        """Initialize with GitHub credentials."""
        self.token = token
        self.org = org
        self.base_url = "https://api.github.com"
        self.headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github+json"
        }

    async def create_repo(
        self,
        name: str,
        description: str,
        private: bool = False,
        auto_init: bool = False
    ) -> Dict[str, Any]:
        """
        Create GitHub repository.

        POST /orgs/{org}/repos
        """
        pass

    async def push_code(
        self,
        repo_name: str,
        files: Dict[str, str],
        commit_message: str
    ):
        """
        Push code to repository (using git subprocess).
        """
        pass
```

---

### Task 3: Testing & Validation (2 hours)

**Goal:** Comprehensive testing of execution engine.

**Files to Create:**

#### 1. `tests/execution/test_business_executor.py` (300 lines)
```python
"""
Tests for Business Execution Engine.
"""

import pytest
from infrastructure.execution.business_executor import BusinessExecutor

class TestBusinessExecutor:
    """Test suite for business execution."""

    @pytest.mark.asyncio
    async def test_simple_saas_deployment(self):
        """Test deploying simple SaaS tool to Vercel."""
        executor = BusinessExecutor(config=test_config)

        business_plan = {
            "name": "Test Writing Tool",
            "description": "AI writing assistant",
            "type": "saas_tool",
            "tech_stack": ["Next.js", "OpenAI"],
            "mvp_features": ["Text input", "AI suggestions"]
        }

        result = await executor.execute_business(business_plan, team=[builder_agent])

        assert result.success is True
        assert result.deployment_url is not None
        assert "vercel.app" in result.deployment_url
        assert result.repo_url is not None

    # ... 10+ more tests
```

---

## 📊 SUCCESS CRITERIA

### Task 1: Business Executor Core
- ✅ `business_executor.py` complete (500 lines)
- ✅ Can generate code via Builder agent
- ✅ Can create GitHub repo and push code
- ✅ Can deploy to Vercel successfully
- ✅ Can validate deployment (HTTP 200, SSL, content)
- ✅ Environment variables configured correctly
- ✅ Rollback works on deployment failure

### Task 2: API Clients
- ✅ `vercel_client.py` complete (300 lines)
- ✅ `github_client.py` complete (200 lines)
- ✅ All API methods functional
- ✅ Error handling for API failures

### Task 3: Testing
- ✅ 10+ tests passing (pytest)
- ✅ Test deployment to Vercel succeeds
- ✅ Validation catches failures

---

## 🔗 INTEGRATION POINTS

### Integrate With:
1. **Genesis Meta-Agent** (Cora's work)
   - Receive business plans
   - Execute deployment
2. **Builder Agent** (`agents/builder_agent.py`)
   - Generate code for business
3. **Vercel API** (External service)
   - Deploy websites
4. **GitHub API** (External service)
   - Create repos, push code

---

## 📚 RESOURCES

### Use Context7 MCP for:
- Vercel API documentation
- GitHub API documentation
- Next.js 14 best practices
- Deployment automation patterns

### Use Haiku 4.5 for:
- Code generation (executor, clients)
- Test generation

---

## 📝 DELIVERABLES CHECKLIST

- [ ] `infrastructure/execution/business_executor.py` (500 lines)
- [ ] `infrastructure/execution/deployment_validator.py` (200 lines)
- [ ] `infrastructure/execution/vercel_client.py` (300 lines)
- [ ] `infrastructure/execution/github_client.py` (200 lines)
- [ ] `tests/execution/test_business_executor.py` (300 lines)
- [ ] **Tests passing:** 10/10 tests (100%)
- [ ] **Test deployment:** 1 real website deployed to Vercel
- [ ] **Documentation:** Update `docs/DEPLOYMENT_GUIDE.md`

---

**Created:** November 3, 2025
**Owner:** Thon
**Status:** READY TO START
**Estimated Completion:** 10 hours
**Dependencies:** Cora's Genesis Meta-Agent (being built in parallel)
