# Genesis Agent API Reference

**Version:** 2.0
**Last Updated:** November 14, 2025
**Audit Date:** November 14, 2025

This document provides a comprehensive reference for all agent APIs in the Genesis system. All agents follow consistent patterns and conventions.

---

## Table of Contents

1. [API Conventions](#api-conventions)
2. [Common Patterns](#common-patterns)
3. [Agent Reference](#agent-reference)
4. [Integration Examples](#integration-examples)
5. [Common Pitfalls](#common-pitfalls)

---

## API Conventions

### Standard Constructor Pattern

All agents follow this constructor pattern:

```python
class Agent:
    def __init__(
        self,
        business_id: str = "default",
        enable_memory: bool = True
    ):
        ...
```

**Parameters:**
- `business_id`: Unique identifier for the business/project (default: "default")
- `enable_memory`: Enable persistent memory features (default: True)

### Factory Functions

Many agents provide factory functions for easier initialization:

```python
async def get_<agent_name>_agent(
    business_id: str = "default",
    enable_memory: bool = True
) -> Agent:
    """Factory function to create agent."""
    return Agent(business_id=business_id, enable_memory=enable_memory)
```

### Statistics Method

All agents provide a `get_statistics()` or `get_stats()` method:

```python
def get_statistics(self) -> Dict[str, Any]:
    """Get agent performance statistics."""
    return {
        "agent_id": self.agent_id,
        "operations_completed": self.ops_count,
        "success_rate": self.success_rate,
        "memory_enabled": self.enable_memory
    }
```

---

## Common Patterns

### Async vs Sync Methods

Some agents provide both async and sync versions of methods:

```python
# Synchronous wrapper (for compatibility)
def method(self, param: str) -> Result:
    return asyncio.run(self._method_async(param))

# Async implementation
async def _method_async(self, param: str) -> Result:
    # Actual implementation
    ...
```

### Memory Integration

Agents with memory support provide these methods:

```python
async def store_pattern(self, data: Dict, success: bool, user_id: str = None) -> bool:
    """Store execution pattern for learning."""
    ...

async def recall_patterns(self, query: str, top_k: int = 5) -> List[Dict]:
    """Recall similar successful patterns."""
    ...
```

### Error Handling

All agents return result objects with consistent structure:

```python
@dataclass
class Result:
    success: bool
    data: Optional[Any] = None
    error: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
```

---

## Agent Reference

### 1. BusinessGenerationAgent

**Purpose:** Autonomous business idea generation and validation

**Constructor:**
```python
def __init__(
    self,
    business_id: str = "default",
    enable_memory: bool = True,
    enable_multimodal: bool = True
)
```

**Key Methods:**
```python
async def generate_idea_with_memory(
    self,
    business_type: Optional[str] = None,
    min_revenue_score: float = 70.0,
    max_attempts: int = 5,
    user_id: Optional[str] = None,
    learn_from_past: bool = True
) -> BusinessIdea
```

**Factory:**
```python
async def get_business_generation_agent(
    business_id: str = "default",
    enable_memory: bool = True
) -> BusinessGenerationAgent
```

**Status:** ✅ Working

---

### 2. DeployAgent

**Purpose:** Application deployment to cloud platforms

**Constructor:**
```python
def __init__(
    self,
    business_id: str = "default",
    use_learning: bool = True,
    use_reflection: bool = True,
    enable_memory: bool = True
)
```

**Key Methods:**
```python
async def deploy_to_vercel(
    self,
    repo_name: str,
    github_url: str,
    env_vars: Optional[Dict[str, str]] = None
) -> DeploymentResult

def prepare_deployment_files(
    self,
    business_name: str,
    code_files: Dict[str, str],
    framework: str = "nextjs"
) -> Dict[str, Any]

def push_to_github(
    self,
    deploy_dir: str,
    repo_name: str,
    branch: str = "main"
) -> bool

def verify_deployment(
    self,
    deployment_url: str,
    expected_status: int = 200
) -> bool

def rollback_deployment(
    self,
    platform: str,
    deployment_id: str,
    target_version: str
) -> bool

def get_statistics() -> Dict[str, Any]
```

**Status:** ✅ Working

---

### 3. DatabaseDesignAgent

**Purpose:** Database schema design with memory learning

**Constructor:**
```python
def __init__(
    self,
    business_id: str = "default",
    enable_memory: bool = True
)
```

**Key Methods:**
```python
# Simplified API (for quick schema generation)
def design_schema(
    self,
    business_type: str,  # "ecommerce", "saas", etc.
    requirements: Optional[List[str]] = None,  # ["users", "data"]
    database_type: str = "postgresql",
    user_id: Optional[str] = None
) -> SchemaResult

# Advanced API (with full config)
def design_schema(
    self,
    config: SchemaConfig,
    user_id: Optional[str] = None
) -> SchemaResult

def get_statistics() -> Dict[str, Any]
```

**Example:**
```python
# Simple usage
agent = DatabaseDesignAgent(business_id="my_business")
result = agent.design_schema(
    business_type="ecommerce",
    requirements=["users", "products", "orders"]
)

# Advanced usage
config = SchemaConfig(
    schema_name="my_db",
    database_type="postgresql",
    tables=[...],
    relationships=[...],
    indexes=[...]
)
result = agent.design_schema(config=config)
```

**Factory:**
```python
async def get_database_design_agent(
    business_id: str = "default",
    enable_memory: bool = True
) -> DatabaseDesignAgent
```

**Status:** ✅ Fixed (Nov 14, 2025)

---

### 4. APIDesignAgent

**Purpose:** RESTful API design and documentation

**Constructor:**
```python
def __init__(
    self,
    business_id: str = "default",
    enable_memory: bool = True
)
```

**Key Methods:**
```python
async def design_api(
    self,
    api_type: str = "REST",
    resources: List[str] = None,
    user_id: Optional[str] = None
) -> APIDesignResult

def get_statistics() -> Dict[str, Any]
```

**Factory:**
```python
async def get_api_design_agent(
    business_id: str = "default",
    enable_memory: bool = True
) -> APIDesignAgent
```

**Status:** ✅ Working

---

### 5. StripeIntegrationAgent

**Purpose:** Payment integration with Stripe

**Constructor:**
```python
def __init__(
    self,
    business_id: str = "default",
    enable_memory: bool = True
)
```

**Key Methods:**
```python
# Setup payment integration for a business
def setup_payment_integration(
    self,
    business_id: str,
    payment_type: str = "one_time",  # "one_time", "subscription", "usage_based"
    currency: str = "usd",
    user_id: Optional[str] = None
) -> PaymentResult

# Process a payment
async def process_payment(
    self,
    config: PaymentConfig,
    user_id: Optional[str] = None
) -> PaymentResult

def get_statistics() -> Dict[str, Any]
```

**Example:**
```python
agent = StripeIntegrationAgent(business_id="my_business")

# Setup integration
result = agent.setup_payment_integration(
    business_id="my_business",
    payment_type="subscription",
    currency="usd"
)

# Process payment
config = PaymentConfig(
    payment_type="subscription",
    amount=29.99,
    currency="usd"
)
result = await agent.process_payment(config)
```

**Factory:**
```python
async def get_stripe_integration_agent(
    business_id: str = "default",
    enable_memory: bool = True
) -> StripeIntegrationAgent
```

**Status:** ✅ Fixed (Nov 14, 2025)

---

### 6. Auth0IntegrationAgent

**Purpose:** Authentication and authorization with Auth0

**Constructor:**
```python
def __init__(
    self,
    business_id: str = "default",
    enable_memory: bool = True
)
```

**Key Methods:**
```python
async def setup_auth(
    self,
    app_name: str,
    auth_type: str = "oauth2",
    providers: List[str] = None
) -> AuthResult

def get_statistics() -> Dict[str, Any]
```

**Status:** ✅ Working

---

### 7. ContentCreationAgent

**Purpose:** Content generation for blogs, marketing, etc.

**Constructor:**
```python
def __init__(
    self,
    business_id: str = "default",
    enable_memory: bool = True,
    mongodb_uri: Optional[str] = None
)
```

**Key Methods:**
```python
async def generate_content(
    self,
    content_type: str,  # "blog_post", "email", "social_media"
    topic: str,
    target_audience: str,
    tone: str = "professional"
) -> ContentResult

def get_stats() -> Dict[str, Any]
```

**Status:** ✅ Working

---

### 8. SEOOptimizationAgent

**Purpose:** SEO optimization and keyword analysis

**Constructor:**
```python
def __init__(
    self,
    business_id: str = "default",
    enable_memory: bool = True,
    mongodb_uri: Optional[str] = None
)
```

**Key Methods:**
```python
async def optimize_content(
    self,
    content: str,
    target_keywords: List[str],
    meta_description: Optional[str] = None
) -> SEOResult

def get_stats() -> Dict[str, Any]
```

**Status:** ✅ Working

---

### 9. EmailMarketingAgent

**Purpose:** Email campaign creation and management

**Constructor:**
```python
def __init__(
    self,
    business_id: str = "default",
    enable_memory: bool = True,
    mongodb_uri: Optional[str] = None
)
```

**Key Methods:**
```python
async def create_campaign(
    self,
    campaign_name: str,
    subject: str,
    template_id: str,
    recipients: Optional[List[str]] = None
) -> CampaignResult

def get_stats() -> Dict[str, Any]
```

**Status:** ✅ Working

---

### 10. MarketingAgentMultimodal

**Purpose:** Multimodal marketing content generation

**Constructor:**
```python
def __init__(
    self,
    enable_memory: bool = True
)
```

**Key Methods:**
```python
async def create_campaign(
    self,
    campaign_type: str,
    target_platform: str,
    content: str,
    visual_assets: Optional[List[str]] = None
) -> MarketingResult

def get_agent_stats() -> Dict[str, Any]
```

**Status:** ✅ Working

---

### 11. UIUXDesignAgent

**Purpose:** UI/UX design and prototyping

**Constructor:**
```python
def __init__(
    self,
    business_id: str = "default",
    enable_memory: bool = True,
    enable_multimodal: bool = True
)
```

**Key Methods:**
```python
async def design_interface(
    self,
    app_type: str,
    target_audience: str,
    features: List[str]
) -> DesignResult

def get_statistics() -> Dict[str, Any]
```

**Status:** ✅ Working

---

### 12. SupportAgent

**Purpose:** Customer support ticket management

**Constructor:**
```python
def __init__(
    self,
    business_id: str = "default",
    enable_memory: bool = True
)
```

**Key Methods:**
```python
async def create_ticket(
    self,
    user_id: str,
    issue_description: str,
    priority: str = "medium"  # "low", "medium", "high", "urgent"
) -> TicketResult

async def escalate_ticket(
    self,
    ticket_id: str,
    escalation_reason: str,
    escalation_team: str
) -> EscalationResult

async def search_knowledge_base(
    self,
    query: str,
    category: Optional[str] = None
) -> List[Dict[str, Any]]

async def generate_support_report(
    self,
    start_date: str,
    end_date: str
) -> ReportResult

def route_task(
    self,
    task_description: str,
    priority: str = "medium"
) -> RoutingResult

def get_statistics() -> Dict[str, Any]
```

**Status:** ✅ Working

---

### 13. AnalyticsAgent

**Purpose:** Business analytics and reporting

**Constructor:**
```python
def __init__(
    self,
    business_id: str = "default",
    enable_memory: bool = True,
    mongodb_uri: Optional[str] = None
)
```

**Key Methods:**
```python
async def generate_report(
    self,
    start_date: str,
    end_date: str,
    metrics: List[str]  # ["revenue", "users", "conversion_rate"]
) -> AnalyticsReport

def get_stats() -> Dict[str, Any]
```

**Status:** ✅ Working

---

### 14. MonitoringAgent

**Purpose:** System monitoring and health checks

**Constructor:**
```python
def __init__(
    self,
    business_id: str = "default",
    enable_memory: bool = True
)
```

**Key Methods:**
```python
async def monitor_system(
    self,
    endpoints: List[str],
    check_interval: int = 60
) -> MonitoringResult

def get_statistics() -> Dict[str, Any]
```

**Status:** ✅ Working

---

### 15. QAAgent

**Purpose:** Quality assurance and testing

**Constructor:**
```python
def __init__(
    self,
    business_id: str = "default",
    enable_memory: bool = True,
    enable_token_caching: bool = True
)
```

**Key Methods:**
```python
async def create_test_plan(
    self,
    feature_name: str,
    test_types: List[str],  # ["unit", "integration", "e2e"]
    coverage_target: float = 0.8
) -> TestPlanResult

async def run_test_suite(
    self,
    test_suite_name: str,
    environment: str = "staging"
) -> TestResult

async def report_bug(
    self,
    bug_description: str,
    severity: str,  # "low", "medium", "high", "critical"
    steps_to_reproduce: List[str]
) -> BugReport

async def measure_code_quality(
    self,
    repository: str,
    branch: str = "main"
) -> QualityMetrics

async def validate_acceptance_criteria(
    self,
    story_id: str,
    criteria: List[str]
) -> ValidationResult

def get_statistics() -> Dict[str, Any]
```

**Status:** ✅ Working

---

### 16. CodeReviewAgent

**Purpose:** Automated code review and analysis

**Constructor:**
```python
def __init__(
    self,
    enable_token_caching: bool = True
)
```

**Key Methods:**
```python
async def review_code(
    self,
    code: str,
    file_path: str,
    context: Optional[str] = None
) -> ReviewResult

def get_cache_stats() -> Dict[str, Any]
```

**Status:** ✅ Working

---

### 17. DocumentationAgent

**Purpose:** Code documentation generation

**Constructor:**
```python
def __init__(
    self,
    business_id: str = "default",
    enable_memory: bool = True
)
```

**Key Methods:**
```python
async def generate_documentation(
    self,
    code: str,
    doc_type: str = "api"  # "api", "user_guide", "technical"
) -> DocumentationResult

def get_cache_stats() -> Dict[str, Any]
```

**Factory:**
```python
async def get_documentation_agent(
    business_id: str = "default",
    enable_memory: bool = True
) -> DocumentationAgent
```

**Status:** ✅ Working

---

### 18. DataJuicerAgent

**Purpose:** Data curation and quality improvement

**Constructor:**
```python
def __init__(
    self,
    business_id: str = "default",
    enable_memory: bool = True,
    mongodb_uri: Optional[str] = None
)
```

**Key Methods:**
```python
async def curate_dataset(
    self,
    dataset_name: str,
    quality_threshold: float = 0.8
) -> CurationResult

def get_stats() -> Dict[str, Any]
```

**Factory:**
```python
def create_data_juicer_agent(
    business_id: str = "default",
    enable_memory: bool = True
) -> DataJuicerAgent
```

**Status:** ✅ Working

---

### 19. ReActTrainingAgent

**Purpose:** ReAct (Reasoning + Acting) agent training

**Constructor:**
```python
def __init__(
    self,
    business_id: str = "default",
    enable_memory: bool = True,
    mongodb_uri: Optional[str] = None,
    training_config: Optional[Dict] = None
)
```

**Key Methods:**
```python
async def train_agent(
    self,
    training_data: str,
    epochs: int = 10
) -> TrainingResult

def get_stats() -> Dict[str, Any]
```

**Factory:**
```python
def create_react_training_agent(
    business_id: str = "default",
    enable_memory: bool = True
) -> ReActTrainingAgent
```

**Status:** ✅ Working

---

### 20. SEDarwinAgent

**Purpose:** Evolutionary algorithm for agent optimization

**Constructor:**
```python
def __init__(
    self,
    agent_name: str,
    llm_client: Optional[Any] = None,
    trajectories_per_iteration: int = 5,
    max_iterations: int = 10,
    timeout_per_trajectory: int = 300,
    success_threshold: float = 0.8,
    benchmark_type: str = "coding"
)
```

**Key Methods:**
No public methods (internal evolutionary loop)

**Factory:**
```python
async def get_se_darwin_agent(
    agent_name: str = "darwin_agent"
) -> SEDarwinAgent

def get_scenarios_for_agent(
    agent_name: str
) -> List[Dict[str, Any]]
```

**Status:** ✅ Working

---

### 21. GeminiComputerUseAgent

**Purpose:** Computer use automation with Gemini

**Constructor:**
```python
def __init__(
    self,
    enable_memory: bool = True
)
```

**Key Methods:**
```python
async def execute_computer_task(
    self,
    task: str,
    environment: str = "browser"
) -> ExecutionResult

def get_agent_stats() -> Dict[str, Any]
```

**Status:** ✅ Working

---

## Integration Examples

### Example 1: Generate and Deploy a Business

```python
import asyncio
from agents.business_generation_agent import BusinessGenerationAgent
from agents.deploy_agent import get_deploy_agent
from agents.database_design_agent import DatabaseDesignAgent

async def create_and_deploy_business():
    # Step 1: Generate business idea
    biz_agent = await BusinessGenerationAgent.create(
        business_id="my_startup",
        enable_memory=True
    )

    idea = await biz_agent.generate_idea_with_memory(
        business_type="saas",
        min_revenue_score=70.0,
        learn_from_past=True
    )

    print(f"Generated: {idea.name} (score: {idea.overall_score})")

    # Step 2: Design database
    db_agent = DatabaseDesignAgent(business_id="my_startup")
    schema = db_agent.design_schema(
        business_type="saas",
        requirements=["users", "subscriptions", "analytics"]
    )

    print(f"Created schema: {schema.schema_name}")

    # Step 3: Deploy
    deploy_agent = await get_deploy_agent(business_id="my_startup")
    deployment = await deploy_agent.deploy_to_vercel(
        repo_name=idea.name.lower().replace(" ", "-"),
        github_url="https://github.com/myorg/repo"
    )

    print(f"Deployed to: {deployment.url}")

asyncio.run(create_and_deploy_business())
```

### Example 2: Setup Payment Processing

```python
from agents.stripe_integration_agent import StripeIntegrationAgent

# Initialize agent
stripe_agent = StripeIntegrationAgent(business_id="my_business")

# Setup subscription billing
result = stripe_agent.setup_payment_integration(
    business_id="my_business",
    payment_type="subscription",
    currency="usd"
)

if result.success:
    print(f"Payment integration ready: {result.payment_id}")
else:
    print(f"Error: {result.error}")
```

### Example 3: QA Testing Workflow

```python
from agents.qa_agent import QAAgent

qa = QAAgent(business_id="my_business")

# Create test plan
plan = await qa.create_test_plan(
    feature_name="User Authentication",
    test_types=["unit", "integration", "e2e"],
    coverage_target=0.85
)

# Run tests
results = await qa.run_test_suite(
    test_suite_name="auth_tests",
    environment="staging"
)

# Report any bugs found
if results.failures:
    await qa.report_bug(
        bug_description="Login fails for Google OAuth",
        severity="high",
        steps_to_reproduce=[
            "Click 'Sign in with Google'",
            "Authorize application",
            "Redirects to /error instead of /dashboard"
        ]
    )
```

---

## Common Pitfalls

### 1. Forgetting to await async methods

```python
# ❌ WRONG - missing await
result = agent.process_payment(config)

# ✅ CORRECT
result = await agent.process_payment(config)
```

### 2. Wrong parameter types

```python
# ❌ WRONG - passing dict instead of string
db_agent.design_schema(
    business_type={"type": "ecommerce"},  # Should be string!
    requirements=["users"]
)

# ✅ CORRECT
db_agent.design_schema(
    business_type="ecommerce",
    requirements=["users"]
)
```

### 3. Not handling async/sync properly

```python
# ❌ WRONG - calling async method from sync context
def my_function():
    result = agent.async_method()  # Won't work!

# ✅ CORRECT - use asyncio.run or make function async
async def my_function():
    result = await agent.async_method()

# OR
def my_function():
    result = asyncio.run(agent.async_method())
```

### 4. Missing required parameters

```python
# ❌ WRONG - missing required business_id
stripe_agent.setup_payment_integration(
    payment_type="subscription"
)  # Error: business_id required!

# ✅ CORRECT
stripe_agent.setup_payment_integration(
    business_id="my_business",
    payment_type="subscription"
)
```

### 5. Not checking result.success

```python
# ❌ WRONG - assuming success
result = agent.process()
print(result.data)  # Might be None if failed!

# ✅ CORRECT - check success first
result = agent.process()
if result.success:
    print(result.data)
else:
    print(f"Error: {result.error}")
```

---

## API Consistency Report

### Consistent Patterns ✅

- All agents have a `business_id` parameter
- All agents support `enable_memory` flag
- All agents have statistics methods
- All agents return structured result objects
- All agents use async/await for I/O operations

### Inconsistencies Found ⚠️

1. **Statistics method naming:**
   - Most use `get_statistics()`
   - Some use `get_stats()` (ContentCreationAgent, SEOOptimizationAgent, etc.)
   - Some use `get_cache_stats()` (CodeReviewAgent, DocumentationAgent)
   - Some use `get_agent_stats()` (MarketingAgentMultimodal, GeminiComputerUseAgent)

2. **Factory function naming:**
   - Most use `get_<agent>_agent()`
   - Some use `create_<agent>_agent()`

3. **Constructor parameters:**
   - Most have `business_id` parameter
   - Some omit it (MarketingAgentMultimodal, GeminiComputerUseAgent, CodeReviewAgent)

### Recommendations

1. Standardize statistics method to `get_statistics()` across all agents
2. Standardize factory functions to `get_<agent>_agent()` pattern
3. Add `business_id` parameter to all agents for consistency
4. Document which methods are sync vs async more clearly

---

**Document Version:** 2.0
**Generated by:** AgentAPIAuditor
**Next Audit:** Monthly
