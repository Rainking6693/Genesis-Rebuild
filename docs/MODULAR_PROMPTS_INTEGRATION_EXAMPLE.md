# Modular Prompts: Integration Examples

This document shows how to integrate the modular prompt system into existing agent code.

## Basic Integration Pattern

### Before (Monolithic Prompt)

```python
class BuilderAgent:
    def __init__(self):
        # Entire prompt hardcoded in code
        self.prompt = """
        You are the Builder Agent for Genesis businesses.

        # Responsibilities
        - Generate application code
        - Build system components
        ...

        # Examples
        Input: Generate ecommerce site
        Output: [complete code]
        ...
        """

    async def generate(self, spec):
        response = self.llm.generate(self.prompt + f"\n\nBuild: {spec.task}")
        return response
```

**Problems:**
- 500+ lines in code file
- Hard to update (need to redeploy)
- Duplication across agents
- Version control nightmare

### After (Modular Prompts)

```python
from infrastructure.prompts import ModularPromptAssembler

class BuilderAgent:
    def __init__(self):
        self.assembler = ModularPromptAssembler()

    async def generate(self, spec):
        # Load prompt from modular files
        prompt = self.assembler.assemble(
            agent_id="builder_agent",
            task_context=f"Build: {spec.task}"
        )

        response = self.llm.generate(prompt)
        return response
```

**Benefits:**
- 4 lines to load prompt
- Update via git (version controlled)
- No code deployment needed
- Reusable for all agents

## Integration with HALO Router

```python
from infrastructure.prompts import ModularPromptAssembler
from infrastructure.halo_router import HALORouter

class EnhancedHALORouter:
    def __init__(self):
        self.router = HALORouter()
        self.assembler = ModularPromptAssembler()

    async def route_and_execute(self, task):
        # 1. Select best agent using HALO routing
        agent_id = self.router.select_agent(task)

        # 2. Assemble agent's modular prompt
        prompt = self.assembler.assemble(
            agent_id=agent_id,
            include_sections=["policy", "schema"],  # Omit memory for speed
            task_context=task.description
        )

        # 3. Execute with assembled prompt
        result = await self.router.execute_with_llm(
            agent_name=agent_id,
            prompt=prompt,
            max_tokens=4096
        )

        # 4. Update agent's memory with result
        if result.success:
            self.assembler.update_memory(agent_id, {
                "last_task_success": True,
                "last_task_timestamp": datetime.now().isoformat()
            })

        return result
```

## Integration with Genesis Meta-Agent

```python
from infrastructure.prompts import ModularPromptAssembler
from infrastructure.genesis_meta_agent import GenesisMetaAgent

class ModularGenesisMetaAgent(GenesisMetaAgent):
    def __init__(self, use_local_llm: bool = True):
        super().__init__(use_local_llm)
        self.assembler = ModularPromptAssembler()

    async def generate_business(self, spec):
        """Generate business using modular prompts"""
        logger.info(f"Starting business generation: {spec.name}")
        start_time = time.time()

        # Decompose business to tasks
        dag = self._decompose_business_to_tasks(spec)

        task_results = {}
        for task in dag.get_all_tasks():
            if task.task_id == "root":
                continue

            # Assemble builder agent prompt
            component_name = task.description.replace("Build ", "")
            prompt = self.assembler.assemble(
                agent_id="builder_agent",
                variables={"component": component_name},
                task_context=f"Build {component_name} for {spec.business_type}"
            )

            # Execute with assembled prompt
            result = self._execute_task_with_llm(task, prompt)
            task_results[task.task_id] = result

            # Update memory with metrics
            if result.get("success"):
                self.assembler.update_memory("builder_agent", {
                    "last_component": component_name,
                    "components_built": len([r for r in task_results.values() if r.get("success")])
                })

        return BusinessGenerationResult(...)

    def _execute_task_with_llm(self, task, prompt):
        """Execute task using pre-assembled modular prompt"""
        try:
            response = self.router.execute_with_llm(
                agent_name="builder_agent",
                prompt=prompt,
                max_tokens=4096
            )

            if not response or len(response) < 50:
                return {"success": False, "error": "No valid response"}

            # Extract and validate code
            clean_code = extract_and_validate(response, task.description)

            return {
                "success": True,
                "result": clean_code,
                "component": task.description
            }
        except Exception as e:
            logger.error(f"Task execution failed: {e}")
            return {"success": False, "error": str(e)}
```

## A/B Testing with Modular Prompts

```python
class ModularPromptABTester:
    def __init__(self):
        self.assembler = ModularPromptAssembler()

    async def ab_test(self, agent_id, task, num_trials=10):
        """A/B test two prompt variants"""

        # Variant A: Standard prompt
        prompt_a = self.assembler.assemble(agent_id)

        # Variant B: Enhanced fewshots (add more examples)
        prompt_b = self.assembler.assemble(
            agent_id,
            include_sections=["policy", "schema", "memory", "fewshots"]
        )

        results_a = []
        results_b = []

        for i in range(num_trials):
            # Test variant A
            response_a = await self.llm.generate(prompt_a + f"\n\n{task}")
            score_a = self.evaluate_response(response_a)
            results_a.append(score_a)

            # Test variant B
            response_b = await self.llm.generate(prompt_b + f"\n\n{task}")
            score_b = self.evaluate_response(response_b)
            results_b.append(score_b)

        avg_a = sum(results_a) / len(results_a)
        avg_b = sum(results_b) / len(results_b)

        print(f"Variant A avg: {avg_a:.3f}")
        print(f"Variant B avg: {avg_b:.3f}")
        print(f"Winner: {'B (+{:.1f}%)'.format((avg_b/avg_a - 1) * 100) if avg_b > avg_a else 'A'}")

        return {
            "variant_a_score": avg_a,
            "variant_b_score": avg_b,
            "improvement": (avg_b - avg_a) / avg_a * 100
        }
```

## Updating Prompts at Runtime

### Add New Examples

```python
assembler = ModularPromptAssembler()

# Add new few-shot example based on successful execution
assembler.add_fewshot_example(
    agent_id="qa_agent",
    input_text="Run tests for payment module",
    output_text="""## Test Results: Payment Module

**Summary:** 15 tests, 15 passed, 0 failed
**Coverage:** 92%
**Performance:** All tests < 100ms

**Recommendation:** Merge to main"""
)
```

### Update Learned Patterns

```python
# After analyzing test results
assembler.update_memory("qa_agent", {
    "last_test_run": {
        "timestamp": datetime.now().isoformat(),
        "total_tests": 156,
        "passed": 154,
        "coverage": "89.4%"
    },
    "recent_learnings": [
        "Use pytest --maxfail=1 for early failure detection",
        "Mock Stripe API calls to speed up payment tests by 60%",
        "Database tests 3x faster with in-memory SQLite"
    ]
})
```

### Selective Prompt Assembly for Performance

```python
# For quick decision-making (policy only)
fast_prompt = assembler.assemble(
    agent_id="qa_agent",
    include_sections=["policy"]  # Lightweight
)

# For detailed analysis (all sections)
detailed_prompt = assembler.assemble(
    agent_id="qa_agent"  # Default: all sections
)

# For template-driven generation
templated_prompt = assembler.assemble(
    agent_id="builder_agent",
    variables={
        "language": "TypeScript",
        "framework": "Next.js",
        "database": "PostgreSQL"
    }
)
```

## Migration from Hardcoded Prompts

### Step 1: Extract Prompt Components

```python
# Before: Hardcoded in code
OLD_PROMPT = """
You are the QA Agent.

Role: Test and validate applications.

Responsibilities:
- Run tests
- Report coverage
...
"""

# After: Split into files
# qa_agent_policy.md
# qa_agent_schema.yaml
# qa_agent_memory.json
# qa_agent_fewshots.yaml
```

### Step 2: Create ModularPromptAssembler Instance

```python
class ModularQAAgent:
    def __init__(self):
        self.assembler = ModularPromptAssembler()
        # OLD: self.prompt = OLD_PROMPT
```

### Step 3: Use Assembled Prompt

```python
    async def run_tests(self, test_path):
        # OLD: prompt = self.prompt + f"\n\nRun: {test_path}"
        # NEW:
        prompt = self.assembler.assemble(
            agent_id="qa_agent",
            task_context=f"Run: {test_path}"
        )

        response = await self.llm.generate(prompt)
        return response
```

## Debugging with Modular Prompts

### View Individual Components

```python
assembler = ModularPromptAssembler()

# What's the agent's role and constraints?
policy = assembler.get_policy("qa_agent")
print(policy)

# What tools can it use?
schema = assembler.get_schema("qa_agent")
print(f"Available tools: {[t['name'] for t in schema['tools']]}")

# What has it learned?
memory = assembler.get_memory("qa_agent")
print(f"Last test run: {memory['last_test_run']}")

# What examples does it have?
fewshots = assembler.get_fewshots("qa_agent")
print(f"Number of examples: {len(fewshots['examples'])}")
```

### Validate Prompt Integrity

```python
# Check all required files exist
validation = assembler.validate_agent_prompts("qa_agent")
if not all(validation.values()):
    missing = [k for k, v in validation.items() if not v]
    raise ValueError(f"Missing files for qa_agent: {missing}")

# Get statistics
stats = assembler.get_statistics()
print(f"Total agents: {stats['total_agents']}")
print(f"Total files: {stats['total_files']}")
print(f"Agents: {', '.join(stats['agents'])}")
```

## Best Practices

### 1. Always Validate on Startup

```python
def __init__(self):
    self.assembler = ModularPromptAssembler()

    # Validate all agent prompts exist
    for agent_id in self.assembler.list_agents():
        validation = self.assembler.validate_agent_prompts(agent_id)
        if not all(validation.values()):
            raise RuntimeError(f"Invalid prompts for {agent_id}: {validation}")

    logger.info(f"✅ All {len(self.assembler.list_agents())} agents validated")
```

### 2. Update Memory After Task Completion

```python
async def execute_task(self, agent_id, task):
    result = await self.do_task(agent_id, task)

    # Record outcome in memory
    if result.success:
        self.assembler.update_memory(agent_id, {
            "last_success": datetime.now().isoformat(),
            "success_rate": self.compute_success_rate(agent_id)
        })

    return result
```

### 3. Use Selective Sections for Efficiency

```python
# For routing decisions (fast, policy only)
prompt = assembler.assemble(agent_id, include_sections=["policy"])

# For detailed work (comprehensive, all sections)
prompt = assembler.assemble(agent_id)

# For lightweight validation (policy + schema)
prompt = assembler.assemble(agent_id, include_sections=["policy", "schema"])
```

### 4. Monitor Prompt Assembly Performance

```python
import time

start = time.time()
prompt = assembler.assemble("qa_agent")
elapsed = (time.time() - start) * 1000

logger.info(f"Assembled qa_agent prompt in {elapsed:.1f}ms")

# Cache statistics
cache_stats = assembler.get_statistics()
print(f"Cache size: {cache_stats['cache_size']} prompts")
```

---

**Last Updated:** November 5, 2025
**Status:** Production Ready
