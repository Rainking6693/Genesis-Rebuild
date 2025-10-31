# ROGUE TEST SCENARIOS CATALOG - 1,500 SCENARIOS

**Document Status:** Week 1 Scenario Planning (Phase 7, Nov 4-10, 2025)
**Last Updated:** October 30, 2025
**Purpose:** Complete breakdown of 1,500 automated test scenarios across 5 layers

---

## EXECUTIVE SUMMARY

**Total Scenarios:** 1,500
**Distribution:**
- Layer 1 (Orchestration): 300 scenarios
- Layer 2 (Agents): 1,500 scenarios (15 agents × 100 each)
- Layer 3 (Integration): 200 scenarios
- Layer 4 (Performance): 100 scenarios
- Layer 5 (E2E): 100 scenarios

**Note:** Layer 2 scenarios are the primary focus (1,500 agent-specific tests). Other layers provide critical infrastructure validation.

---

## LAYER 1: ORCHESTRATION TESTS (300 scenarios)

### 1.1 HTDAG Planner Tests (75 scenarios)

#### Success Cases (25 scenarios)

| ID | Description | Input | Expected Output | Policy Checks |
|----|-------------|-------|-----------------|---------------|
| htdag_001 | Simple task decomposition | "Create landing page" | 5-10 tasks, <2s | No circular deps |
| htdag_002 | Complex multi-agent workflow | "Build e-commerce site" | 20-30 tasks, <5s | Valid DAG structure |
| htdag_003 | Parallel task generation | "Deploy 3 microservices" | 3 parallel branches | Independent tasks |
| htdag_004 | Sequential dependency chain | "CI/CD pipeline setup" | 10 sequential tasks | Correct ordering |
| htdag_005 | Nested subtask decomposition | "Implement auth system" | 3 levels deep | No depth overflow |
| htdag_006 | Resource constraint handling | "Task with limited agents" | Prioritized tasks | Resource allocation |
| htdag_007 | Time-bound task planning | "Deploy in 1 hour" | Time estimates | Deadline feasibility |
| htdag_008 | Multi-language code generation | "Build Python + JS app" | 2 language tracks | Correct agent routing |
| htdag_009 | Database migration plan | "Upgrade DB schema" | Safe migration steps | Rollback plan |
| htdag_010 | API integration workflow | "Connect 5 external APIs" | API call sequencing | Error handling |
| htdag_011 | Testing strategy generation | "Test coverage plan" | Test types breakdown | Coverage targets |
| htdag_012 | Documentation generation | "Write API docs" | Doc structure | Completeness |
| htdag_013 | Security audit workflow | "Security review" | 7 security checks | Compliance |
| htdag_014 | Performance optimization | "Optimize slow query" | 5 optimization steps | Metrics |
| htdag_015 | Refactoring plan | "Refactor legacy code" | Safe refactor steps | No breaking changes |
| htdag_016 | Feature flag rollout | "Deploy feature flag" | Staged rollout | Monitoring |
| htdag_017 | Data pipeline design | "ETL pipeline" | Data flow DAG | Data validation |
| htdag_018 | Machine learning workflow | "Train ML model" | ML pipeline steps | Experiment tracking |
| htdag_019 | Infrastructure provisioning | "Set up Kubernetes cluster" | Infra setup tasks | Idempotency |
| htdag_020 | Monitoring setup | "Configure alerts" | Alert strategy | SLO coverage |
| htdag_021 | Compliance checklist | "GDPR compliance audit" | Compliance tasks | Regulatory coverage |
| htdag_022 | Incident response plan | "Handle production outage" | Response procedures | Escalation |
| htdag_023 | Code review workflow | "Review PR with 500 LOC" | Review checklist | Quality gates |
| htdag_024 | Dependency upgrade | "Upgrade Python 3.11 → 3.12" | Migration steps | Compatibility |
| htdag_025 | Multi-region deployment | "Deploy to 3 AWS regions" | Region-specific tasks | Consistency |

#### Edge Cases (25 scenarios)

| ID | Description | Input | Expected Output | Policy Checks |
|----|-------------|-------|-----------------|---------------|
| htdag_026 | Empty task description | "" | Error: "Task description required" | Graceful error |
| htdag_027 | Single-word task | "Deploy" | Clarification request | Context gathering |
| htdag_028 | Ambiguous task | "Fix it" | Disambiguation questions | Clear requirements |
| htdag_029 | Circular dependency attempt | Task A depends on B, B depends on A | Error: "Circular dependency" | Cycle detection |
| htdag_030 | Maximum task depth | 10 levels of nesting | Warning: "Max depth reached" | Depth limit |
| htdag_031 | Unsupported language | "Build COBOL app" | Error: "No agent for COBOL" | Agent availability |
| htdag_032 | Conflicting requirements | "Fast AND cheap AND high-quality" | Warning: "Tradeoff required" | Constraint validation |
| htdag_033 | Missing dependencies | Task B requires Task A output, A not planned | Error: "Missing dependency" | Dependency validation |
| htdag_034 | Duplicate tasks | "Deploy twice" | Warning: "Duplicate detected" | Redundancy check |
| htdag_035 | Extremely large task | "Migrate entire system" | Chunked into subtasks | Memory management |
| htdag_036 | Time paradox | Task B must complete before Task A starts, but A → B | Error: "Temporal conflict" | Temporal consistency |
| htdag_037 | Resource deadlock | Task A needs Agent X locked by Task B | Warning: "Resource conflict" | Deadlock detection |
| htdag_038 | Unknown task type | "Perform quantum computing" | Error: "Unsupported task type" | Task classification |
| htdag_039 | Malformed JSON input | `{"task": unclosed string` | Error: "Invalid JSON" | Input validation |
| htdag_040 | Extremely long task name | 1000-character task name | Truncated with warning | Length limits |
| htdag_041 | Special characters in task | Task with emojis/symbols | Sanitized input | Character encoding |
| htdag_042 | Null values in dependencies | `dependencies: null` | Empty dependency list | Null handling |
| htdag_043 | Negative task priority | `priority: -1` | Error: "Invalid priority" | Value range check |
| htdag_044 | Float task ID | `task_id: 3.14` | Error: "ID must be integer" | Type validation |
| htdag_045 | Missing task metadata | No description, no type | Error: "Insufficient metadata" | Metadata check |
| htdag_046 | Concurrent modification | Two agents modify same DAG | Conflict resolution | Concurrency control |
| htdag_047 | Out-of-order task IDs | Task 5 before Task 2 | Re-ordering applied | ID consistency |
| htdag_048 | Extremely small task | "Add space" | Warning: "Task too trivial" | Task granularity |
| htdag_049 | Self-dependent task | Task A depends on Task A | Error: "Self-dependency" | Self-reference check |
| htdag_050 | Infinite loop potential | Task A → B → C → A | Error: "Cycle detected" | Cycle prevention |

#### Failure Cases (15 scenarios)

| ID | Description | Input | Expected Output | Policy Checks |
|----|-------------|-------|-----------------|---------------|
| htdag_051 | LLM timeout | Task decomposition takes >30s | Fallback to heuristic | Timeout handling |
| htdag_052 | Out of memory | Decompose 10,000-task project | Error: "Memory limit" | Resource limits |
| htdag_053 | Agent unavailable | All Builder agents offline | Error: "No agents available" | Availability check |
| htdag_054 | Invalid API response | LLM returns non-JSON | Error: "Malformed response" | Response validation |
| htdag_055 | Network error | LLM API unreachable | Retry with backoff | Network resilience |
| htdag_056 | Authentication failure | Invalid LLM API key | Error: "Auth failed" | Auth handling |
| htdag_057 | Rate limit exceeded | 100 requests in 1 minute | Error: "Rate limited" | Rate limit handling |
| htdag_058 | DAG size overflow | 1,000+ tasks generated | Error: "DAG too large" | Size limits |
| htdag_059 | Unsolvable task | "Travel faster than light" | Error: "Unsolvable" | Feasibility check |
| htdag_060 | Malicious input | SQL injection attempt | Error: "Invalid input" | Input sanitization |
| htdag_061 | Corrupted state | DAG data structure corrupted | Error: "Data corruption" | State validation |
| htdag_062 | Disk full | Cannot save DAG to disk | Error: "Disk full" | Storage check |
| htdag_063 | Permission denied | No write access to DAG file | Error: "Permission denied" | Permission check |
| htdag_064 | Concurrent write conflict | Two processes write same DAG | Error: "Write conflict" | File locking |
| htdag_065 | Incompatible version | DAG format v2.0, reader v1.0 | Error: "Version mismatch" | Version check |

#### Performance Tests (10 scenarios)

| ID | Description | Input | Expected Output | Policy Checks |
|----|-------------|-------|-----------------|---------------|
| htdag_066 | Fast simple decomposition | 5-task project | <1s decomposition | Speed target |
| htdag_067 | Medium complexity speed | 20-task project | <2s decomposition | Speed target |
| htdag_068 | Large project speed | 100-task project | <5s decomposition | Speed target |
| htdag_069 | Concurrent decomposition | 10 simultaneous requests | All <3s | Parallelism |
| htdag_070 | Memory efficiency | 1,000-task DAG | <500MB memory | Memory target |
| htdag_071 | CPU efficiency | Complex decomposition | <80% CPU usage | CPU target |
| htdag_072 | Cache effectiveness | Repeated identical task | 90% faster on cache hit | Caching |
| htdag_073 | Incremental update speed | Modify 1 task in 100-task DAG | <500ms update | Update speed |
| htdag_074 | Graph traversal speed | Topological sort of 1,000 tasks | <100ms | Algorithm efficiency |
| htdag_075 | Scalability test | Decompose 10 projects in parallel | Linear scalability | Resource scaling |

---

### 1.2 HALO Router Tests (75 scenarios)

#### Success Cases (25 scenarios)

| ID | Description | Task Type | Expected Agent | Routing Time | Policy Checks |
|----|-------------|-----------|----------------|--------------|---------------|
| halo_001 | Route legal query | legal_review | legal_agent | <100ms | Correct agent |
| halo_002 | Route QA task | code_testing | qa_agent | <100ms | Correct agent |
| halo_003 | Route support ticket | customer_support | support_agent | <100ms | Correct agent |
| halo_004 | Route data analysis | financial_analysis | analyst_agent | <100ms | Correct agent |
| halo_005 | Route content creation | blog_writing | content_agent | <100ms | Correct agent |
| halo_006 | Route security audit | security_review | security_agent | <100ms | Correct agent |
| halo_007 | Route deployment task | infra_deploy | deploy_agent | <100ms | Correct agent |
| halo_008 | Route spec writing | requirements_doc | spec_agent | <100ms | Correct agent |
| halo_009 | Route code evolution | code_improvement | se_darwin_agent | <100ms | Correct agent |
| halo_010 | Route vision task | image_ocr | vision_agent | <100ms | Correct agent |
| halo_011 | Load balancing test | 10 QA tasks | Distributed across 3 QA agents | <100ms each | Even distribution |
| halo_012 | Fallback routing | Primary agent down | Secondary agent selected | <200ms | Fallback works |
| halo_013 | Priority routing | High-priority task | Fastest agent selected | <100ms | Priority respected |
| halo_014 | Explainability check | Any routing | Explanation logged | <100ms | Reason provided |
| halo_015 | Multi-agent task | Requires Legal + QA | Both agents selected | <100ms | Multi-agent coordination |
| halo_016 | Context-aware routing | Task with history | Agent with context selected | <100ms | Context considered |
| halo_017 | Skill-based routing | Requires Python + Docker | Agent with both skills | <100ms | Skill matching |
| halo_018 | Geographic routing | Task in EU region | EU-based agent | <100ms | Region affinity |
| halo_019 | Cost-optimized routing | Simple task | Cheapest agent (Gemini Flash) | <100ms | Cost optimization |
| halo_020 | Quality-optimized routing | Complex task | Highest quality agent (GPT-4o) | <100ms | Quality optimization |
| halo_021 | Dynamic agent creation | No suitable agent | New agent spawned | <500ms | Agent creation |
| halo_022 | Rule-based routing | IF task_type=X THEN agent=Y | Rule executed correctly | <50ms | Rule engine works |
| halo_023 | Hierarchical routing | Planning → Design → Execution | 3-tier routing | <150ms | Hierarchy respected |
| halo_024 | Retry logic | Agent timeout | Retry with different agent | <300ms | Retry successful |
| halo_025 | Circuit breaker | Agent failing 5x | Circuit breaker triggered | <100ms | Circuit breaker works |

#### Edge Cases (25 scenarios)

| ID | Description | Input | Expected Output | Policy Checks |
|----|-------------|-------|-----------------|---------------|
| halo_026 | Unknown task type | "task_type: unknown" | Default to orchestration_agent | Fallback routing |
| halo_027 | Ambiguous task type | Matches 2+ agents | Disambiguation request | Conflict resolution |
| halo_028 | All agents busy | 100% capacity | Queue task or scale up | Capacity management |
| halo_029 | Agent authentication failure | Agent token invalid | Error: "Auth failed" | Auth handling |
| halo_030 | Agent version mismatch | Task requires v2.0, agent v1.0 | Error: "Version mismatch" | Version check |
| halo_031 | Null task type | `task_type: null` | Error: "Task type required" | Null handling |
| halo_032 | Empty agent registry | No agents registered | Error: "No agents available" | Registry check |
| halo_033 | Conflicting routing rules | Rule A: agent X, Rule B: agent Y | Higher priority rule wins | Rule precedence |
| halo_034 | Circular routing | Agent A → Agent B → Agent A | Error: "Circular routing" | Cycle detection |
| halo_035 | Agent capacity overload | Agent at 200% load | Reject or queue | Overload protection |
| halo_036 | Malformed routing rules | Invalid rule syntax | Error: "Invalid rule" | Rule validation |
| halo_037 | Agent network partition | Agent unreachable | Fallback to available agent | Network resilience |
| halo_038 | Extremely long task description | 10,000-character task | Truncated before routing | Length limits |
| halo_039 | Special characters in agent name | Agent with emojis | Sanitized name | Name validation |
| halo_040 | Negative agent priority | `priority: -1` | Error: "Invalid priority" | Priority validation |
| halo_041 | Float agent ID | `agent_id: 3.14` | Error: "ID must be string" | Type validation |
| halo_042 | Missing agent metadata | No capabilities defined | Error: "Incomplete metadata" | Metadata check |
| halo_043 | Agent self-routing | Agent routes to itself | Warning: "Self-routing" | Self-reference check |
| halo_044 | Duplicate agent registration | Same agent registered twice | Warning: "Duplicate ignored" | Duplicate detection |
| halo_045 | Agent unregistration mid-task | Agent unregisters while routing | Fallback to another agent | Availability check |
| halo_046 | Time-based routing | Route to agent available at specific time | Time constraint satisfied | Time-aware routing |
| halo_047 | Cost threshold exceeded | Task cost >$1 | Error: "Cost limit exceeded" | Cost limit check |
| halo_048 | Quality threshold unmet | No agent meets min quality | Error: "Quality unmet" | Quality check |
| halo_049 | Latency threshold exceeded | All agents >1s latency | Error: "Latency unmet" | Latency check |
| halo_050 | Agent health check failure | Agent unhealthy | Skip unhealthy agent | Health check |

#### Failure Cases (15 scenarios)

| ID | Description | Input | Expected Output | Policy Checks |
|----|-------------|-------|-----------------|---------------|
| halo_051 | LLM routing timeout | LLM takes >10s to route | Fallback to heuristic routing | Timeout handling |
| halo_052 | Network error | LLM API unreachable | Retry with backoff | Network resilience |
| halo_053 | Authentication failure | Invalid API key | Error: "Auth failed" | Auth handling |
| halo_054 | Rate limit exceeded | 100 routing requests/min | Error: "Rate limited" | Rate limit handling |
| halo_055 | Malicious input | SQL injection in task | Error: "Invalid input" | Input sanitization |
| halo_056 | Corrupted routing rules | Rules file corrupted | Error: "Corrupted rules" | Data integrity |
| halo_057 | Out of memory | 10,000 concurrent routes | Error: "Memory limit" | Resource limits |
| halo_058 | Disk full | Cannot log routing decision | Warning: "Log failed" | Storage check |
| halo_059 | Permission denied | No access to agent registry | Error: "Permission denied" | Permission check |
| halo_060 | Concurrent modification | Two routers modify registry | Conflict resolution | Concurrency control |
| halo_061 | Invalid API response | LLM returns non-JSON | Error: "Malformed response" | Response validation |
| halo_062 | Agent crash during routing | Agent dies mid-routing | Fallback to another agent | Crash recovery |
| halo_063 | Incompatible agent version | Agent protocol v3.0, router v2.0 | Error: "Version mismatch" | Version compatibility |
| halo_064 | Network partition | Agent in different subnet unreachable | Error: "Network unreachable" | Network topology |
| halo_065 | Database connection failure | Cannot access agent registry DB | Error: "DB connection failed" | DB resilience |

#### Performance Tests (10 scenarios)

| ID | Description | Input | Expected Output | Policy Checks |
|----|-------------|-------|-----------------|---------------|
| halo_066 | Fast routing | Simple task | <50ms routing | Speed target |
| halo_067 | Average routing | Medium task | <100ms routing | Speed target |
| halo_068 | Complex routing | Multi-agent task | <150ms routing | Speed target |
| halo_069 | Concurrent routing | 100 simultaneous requests | All <200ms | Parallelism |
| halo_070 | Throughput test | 1,000 routes/minute | ≥16 rps | Throughput target |
| halo_071 | Memory efficiency | 10,000 routing decisions | <200MB memory | Memory target |
| halo_072 | CPU efficiency | Complex routing logic | <50% CPU usage | CPU target |
| halo_073 | Cache effectiveness | Repeated identical task | 95% faster on cache hit | Caching |
| halo_074 | Rule matching speed | Match against 100 rules | <10ms matching | Algorithm efficiency |
| halo_075 | Scalability test | Route 10,000 tasks in parallel | Linear scalability | Resource scaling |

---

### 1.3 AOP Validator Tests (75 scenarios)

**Structure:** Same format as HTDAG/HALO - 25 success, 25 edge, 15 failure, 10 performance

**Key Test Categories:**
- Solvability checks (agent capabilities match requirements)
- Completeness checks (all tasks have assignments)
- Redundancy checks (no duplicate work)
- Reward model validation (quality scoring accuracy)

---

### 1.4 DAAO Router Tests (75 scenarios)

**Structure:** Same format as HTDAG/HALO - 25 success, 25 edge, 15 failure, 10 performance

**Key Test Categories:**
- Model selection (GPT-4o vs Gemini Flash vs Claude)
- Cost optimization (48% reduction validation)
- Quality vs cost tradeoffs
- Budget enforcement

---

## LAYER 2: AGENT TESTS (15 agents × 100 = 1,500 scenarios)

### 2.1 QA Agent (100 scenarios)

#### Success Cases (40 scenarios)

| ID | Description | Input | Expected Output | Policy Checks |
|----|-------------|-------|-----------------|---------------|
| qa_001 | Generate pytest for Python function | `calculate_total(items)` | 5+ tests, 90%+ coverage | Valid pytest syntax |
| qa_002 | Generate Jest for React component | `<Button onClick={} />` | Component + snapshot tests | Valid Jest syntax |
| qa_003 | Generate integration tests | REST API with 3 endpoints | API tests for all endpoints | HTTP methods covered |
| qa_004 | Generate E2E tests | Login → Dashboard flow | Playwright test script | User flow complete |
| qa_005 | Generate security tests | Auth system | OWASP Top 10 coverage | Security best practices |
| qa_006 | Generate performance tests | Database query | Load test with 1000 RPS | Performance metrics |
| qa_007 | Generate mocking examples | External API call | Mock setup + teardown | Proper isolation |
| qa_008 | Generate parameterized tests | Function with multiple inputs | @pytest.mark.parametrize | Edge cases covered |
| qa_009 | Generate fixture setup | Database test suite | pytest fixtures | Proper setup/teardown |
| qa_010 | Generate assertion examples | Complex data structures | Comprehensive assertions | Clear error messages |
| qa_011 | Code review automation | PR with 500 LOC | Review comments | Quality gates |
| qa_012 | Bug reproduction script | Bug report | Minimal reproduction | Reproducible |
| qa_013 | Test data generation | User registration | 100 valid test users | Privacy-compliant |
| qa_014 | Mutation testing | Existing test suite | Mutant survival rate | Coverage gaps identified |
| qa_015 | Test migration | Unittest → pytest | Migrated tests pass | No functionality loss |
| qa_016 | Visual regression tests | UI component | Screenshot comparison | Pixel-perfect |
| qa_017 | Accessibility testing | Web page | WCAG 2.1 compliance | A11y best practices |
| qa_018 | Load testing | API endpoint | Throughput + latency | Performance SLOs |
| qa_019 | Chaos testing | Microservices | Resilience validated | Failure scenarios |
| qa_020 | Test report generation | Test run results | HTML report | Actionable insights |
| qa_021-040 | Additional success scenarios | Various QA tasks | Appropriate test outputs | Quality standards met |

#### Edge Cases (30 scenarios)

| ID | Description | Input | Expected Output | Policy Checks |
|----|-------------|-------|-----------------|---------------|
| qa_041 | Empty function | `def empty(): pass` | Warning: "No logic to test" | Graceful handling |
| qa_042 | Function with no docstring | `def mystery(x): return x*2` | Tests with inferred behavior | Best-effort testing |
| qa_043 | Async function testing | `async def fetch()` | pytest-asyncio tests | Proper async handling |
| qa_044 | Generator function | `def gen(): yield x` | Tests for generator protocol | Iterator testing |
| qa_045 | Decorator testing | `@cache def func()` | Tests verify decorator behavior | Decorator coverage |
| qa_046 | Class with private methods | `def __private()` | Tests focus on public API | Encapsulation respected |
| qa_047 | Function with globals | Uses global variables | Warning: "Global dependency" | Best practices |
| qa_048 | Function with side effects | Modifies external state | Tests with cleanup | Isolation maintained |
| qa_049 | Nested function | Function inside function | Tests for closure behavior | Closure testing |
| qa_050 | Lambda testing | `lambda x: x+1` | Warning: "Lambda not testable" | Suggest refactor |
| qa_051-070 | Additional edge cases | Unusual code patterns | Appropriate handling | Standards enforced |

#### Failure Cases (20 scenarios)

| ID | Description | Input | Expected Output | Policy Checks |
|----|-------------|-------|-----------------|---------------|
| qa_071 | Malformed code | Syntax errors | Error: "Invalid code" | Syntax validation |
| qa_072 | Security vulnerability | Unsafe code | Warning: "Security risk" | Security scan |
| qa_073 | Code too complex | 1000-line function | Warning: "Refactor needed" | Complexity limit |
| qa_074 | Missing dependencies | Imports not installed | Error: "Dependencies missing" | Dependency check |
| qa_075 | Timeout during testing | Long-running tests | Error: "Timeout" | Time limit enforced |
| qa_076-090 | Additional failure scenarios | Various failure modes | Appropriate errors | Error handling |

#### Security Cases (10 scenarios)

| ID | Description | Input | Expected Output | Policy Checks |
|----|-------------|-------|-----------------|---------------|
| qa_091 | SQL injection test | User input function | Tests for injection | Security validated |
| qa_092 | XSS attack test | Web form | XSS prevention verified | Security validated |
| qa_093 | CSRF protection test | Form submission | CSRF token verified | Security validated |
| qa_094 | Authentication bypass test | Login function | Auth validated | Security validated |
| qa_095 | PII handling test | User data function | PII redaction verified | Privacy compliant |
| qa_096-100 | Additional security scenarios | Security-sensitive code | Security coverage | Compliance met |

---

### 2.2-2.15 Other Agents (100 scenarios each)

**Agent List:**
2. Support Agent (100)
3. Legal Agent (100)
4. Analyst Agent (100)
5. Content/Marketing Agent (100)
6. Security Agent (100)
7. Builder Agent (100)
8. Deploy Agent (100)
9. Spec Agent (100)
10. Reflection Agent (100)
11. Orchestration Agent (100)
12. SE-Darwin Agent (100)
13. WaltzRL Conversation Agent (100)
14. WaltzRL Feedback Agent (100)
15. Vision/OCR Agent (100)

**Each agent follows same structure:**
- 40 success cases (core functionality)
- 30 edge cases (boundary conditions)
- 20 failure cases (error handling)
- 10 security cases (WaltzRL safety, PII, prompt injection)

**Example Scenario IDs:**
- support_001 to support_100
- legal_001 to legal_100
- analyst_001 to analyst_100
- etc.

---

## LAYER 3: INTEGRATION TESTS (200 scenarios)

### 3.1 Agent-to-Agent Communication (50 scenarios)

**Example Scenarios:**
- Support escalates to Legal (GDPR query)
- QA requests Builder to fix bug
- Analyst collaborates with Content for report
- Security audits Deploy agent changes
- SE-Darwin improves multiple agents

### 3.2 Orchestration Workflows (50 scenarios)

**Example Scenarios:**
- HTDAG → HALO → AOP full cycle
- Task decomposition with error recovery
- Multi-tier routing with fallbacks
- Plan validation with reward model

### 3.3 Memory System Integration (50 scenarios)

**Example Scenarios:**
- CaseBank retrieval accuracy
- Trajectory logging correctness
- Hybrid RAG performance
- DeepSeek-OCR compression

### 3.4 Safety System Integration (50 scenarios)

**Example Scenarios:**
- WaltzRL wrapper activation
- Pattern detection accuracy
- PII redaction verification
- Prompt injection blocking

---

## LAYER 4: PERFORMANCE TESTS (100 scenarios)

### 4.1 Latency Tests (40 scenarios)

**Targets:**
- Agent response: <5s
- HALO routing: <100ms
- HTDAG decomposition: <2s
- E2E workflow: <30s

### 4.2 Throughput Tests (30 scenarios)

**Targets:**
- Concurrent requests: ≥10 rps
- Parallel execution: 100 simultaneous tasks
- Load balancing: Even distribution

### 4.3 Cost Optimization Tests (30 scenarios)

**Targets:**
- DAAO 48% cost reduction validation
- Model selection correctness (GPT-4o vs Gemini Flash)
- Token usage within budget

---

## LAYER 5: END-TO-END TESTS (100 scenarios)

### 5.1 Business Launch Workflow (20 scenarios)

**Example Flow:**
1. User: "Create e-commerce business"
2. Genesis: Spawns 8 specialized agents
3. Builder: Creates codebase
4. Deploy: Launches to production
5. Monitoring: Health checks active
6. Support: Ready for customers

### 5.2 Customer Support Workflow (20 scenarios)

**Example Flow:**
1. User: Submits support ticket
2. Support: Triages issue
3. Escalation: Routes to Legal/Security/Analyst
4. Resolution: Issue resolved
5. Feedback: User satisfaction recorded

### 5.3 Code Evolution Workflow (20 scenarios)

**Example Flow:**
1. SE-Darwin: Detects improvement opportunity
2. Generation: Creates 3 trajectories
3. Benchmarking: Validates against 270 scenarios
4. Deployment: Winning variant deployed
5. Monitoring: Performance tracked

### 5.4 Safety Incident Workflow (20 scenarios)

**Example Flow:**
1. User: Sends unsafe prompt
2. WaltzRL: Detects violation (37 patterns)
3. Feedback: Provides guidance
4. Conversation: Revises response
5. Logging: Incident recorded

### 5.5 Visual Validation Workflows (20 scenarios)

**Example Flow:**
1. User: Uploads document
2. Vision: OCR processing
3. DeepSeek: Compression applied
4. Analyst: Data extracted
5. Report: Results delivered

---

## SCENARIO PRIORITY LEVELS

### P0 Critical (250 scenarios)
- All orchestration success cases (75)
- All agent core functionality (15 × 10 = 150)
- Critical integration tests (25)

**Why P0:**
- System-breaking if fails
- Required for basic operation
- High user impact

### P1 Important (750 scenarios)
- All orchestration edge cases (75)
- Agent edge cases and failures (15 × 40 = 600)
- Integration workflows (75)

**Why P1:**
- Important but not critical
- Affects quality but not availability
- Medium user impact

### P2 Nice-to-Have (500 scenarios)
- Performance tests (100)
- E2E workflows (100)
- Security edge cases (150)
- Documentation scenarios (150)

**Why P2:**
- Improves experience
- Validates optimizations
- Low user impact

---

## SCENARIO FILE ORGANIZATION

### Directory Structure

```
/home/genesis/genesis-rebuild/tests/rogue/scenarios/
├── layer1_orchestration/
│   ├── htdag_planner_scenarios.json (75)
│   ├── halo_router_scenarios.json (75)
│   ├── aop_validator_scenarios.json (75)
│   └── daao_router_scenarios.json (75)
├── layer2_agents/
│   ├── qa_agent_scenarios.json (100)
│   ├── support_agent_scenarios.json (100)
│   ├── legal_agent_scenarios.json (100)
│   ├── analyst_agent_scenarios.json (100)
│   ├── content_agent_scenarios.json (100)
│   ├── security_agent_scenarios.json (100)
│   ├── builder_agent_scenarios.json (100)
│   ├── deploy_agent_scenarios.json (100)
│   ├── spec_agent_scenarios.json (100)
│   ├── reflection_agent_scenarios.json (100)
│   ├── orchestration_agent_scenarios.json (100)
│   ├── se_darwin_agent_scenarios.json (100)
│   ├── waltzrl_conversation_agent_scenarios.json (100)
│   ├── waltzrl_feedback_agent_scenarios.json (100)
│   └── vision_ocr_agent_scenarios.json (100)
├── layer3_integration/
│   ├── agent_to_agent_scenarios.json (50)
│   ├── orchestration_workflows_scenarios.json (50)
│   ├── memory_system_scenarios.json (50)
│   └── safety_system_scenarios.json (50)
├── layer4_performance/
│   ├── latency_tests_scenarios.json (40)
│   ├── throughput_tests_scenarios.json (30)
│   └── cost_optimization_scenarios.json (30)
└── layer5_e2e/
    ├── business_launch_scenarios.json (20)
    ├── customer_support_scenarios.json (20)
    ├── code_evolution_scenarios.json (20)
    ├── safety_incident_scenarios.json (20)
    └── visual_validation_scenarios.json (20)
```

### File Format (JSON)

```json
{
  "layer": "layer2_agents",
  "agent": "qa_agent",
  "total_scenarios": 100,
  "priority_breakdown": {
    "P0": 10,
    "P1": 40,
    "P2": 50
  },
  "category_breakdown": {
    "success": 40,
    "edge_case": 30,
    "failure": 20,
    "security": 10
  },
  "scenarios": [
    {
      "scenario_id": "qa_001",
      "priority": "P0",
      "category": "success",
      "description": "Generate pytest for Python function",
      "business_context": "QA Agent generates comprehensive test suites for code quality validation",
      "tags": ["pytest", "unit_test", "python"],
      "input": {
        "task": "Generate pytest tests for calculate_total() function",
        "code": "def calculate_total(items):\n    return sum(item.price for item in items)",
        "requirements": ["Edge cases", "Mocking", "Assertions"]
      },
      "expected_output": {
        "status": "success",
        "test_file_generated": true,
        "test_count_min": 5,
        "coverage_target": 90,
        "response_time_max": "5s"
      },
      "policy_checks": [
        "Tests are valid pytest syntax",
        "Edge cases included",
        "No unsafe code execution",
        "PII redacted from examples"
      ],
      "metadata": {
        "created_by": "Alex (E2E Testing Specialist)",
        "created_date": "2025-10-30",
        "last_updated": "2025-10-30",
        "version": "1.0"
      }
    }
  ]
}
```

---

## SCENARIO GENERATION STRATEGY

### Week 1 (Architecture) - Current

- ✅ Define scenario structure and schema
- ✅ Create catalog breakdown (this document)
- ✅ Identify priority levels (P0/P1/P2)
- ✅ Map scenarios to agents

### Week 2 (Implementation) - Next

**Manual Creation (P0 Critical - 250 scenarios):**
- Hand-write all P0 scenarios (highest quality)
- Review by Hudson + Cora
- Validate against Genesis capabilities

**Rogue LLM Generation (P1 Important - 750 scenarios):**
- Use Rogue's scenario generator
- Provide business context for each agent
- LLM generates scenarios automatically
- Manual review of 10% sample

**Hybrid Approach (P2 Nice-to-Have - 500 scenarios):**
- Template-based generation
- Parameterized scenario creation
- Automated validation

### Week 3 (Refinement)

- Run all 1,500 scenarios
- Identify false positives/negatives
- Refine policy checks
- Update scenario definitions

---

## MAINTENANCE STRATEGY

### Continuous Updates

**Triggers for New Scenarios:**
1. New agent added → 100 new scenarios
2. New feature deployed → 10-20 scenarios
3. Bug discovered → 1 regression scenario
4. Policy changed → Update affected scenarios

**Scenario Deprecation:**
1. Agent removed → Archive scenarios
2. Feature deprecated → Mark scenarios obsolete
3. Policy outdated → Update or remove

**Version Control:**
- All scenarios in Git
- Semantic versioning (v1.0.0, v1.1.0, v2.0.0)
- Changelog for major updates

---

## SUCCESS METRICS

### Week 1 (Architecture)
- ✅ 1,500 scenario breakdown complete
- ✅ Priority levels assigned (P0/P1/P2)
- ✅ File organization defined
- ✅ Scenario schema documented

### Week 2 (Implementation)
- [ ] 250 P0 scenarios created (manual)
- [ ] 750 P1 scenarios generated (Rogue LLM)
- [ ] 500 P2 scenarios created (hybrid)
- [ ] ≥85% pass rate on first run

### Week 3 (CI/CD)
- [ ] All 1,500 scenarios integrated
- [ ] ≥95% pass rate achieved
- [ ] CI/CD enforcement active
- [ ] Zero manual testing overhead

---

## REFERENCES

- **Rogue GitHub:** https://github.com/qualifire-dev/rogue
- **Genesis Test Suite:** /home/genesis/genesis-rebuild/tests/ (3,073 existing tests)
- **Agent Project Mapping:** AGENT_PROJECT_MAPPING.md
- **Testing Standards:** TESTING_STANDARDS_UPDATE_SUMMARY.md

---

**Document Status:** COMPLETE - Week 1 Scenario Catalog
**Next:** Create Rogue configuration files and CI/CD workflow
**Owner:** Alex (E2E Testing Specialist)
**Review Required:** Forge (testing automation), Hudson (quality), Cora (agent design)
