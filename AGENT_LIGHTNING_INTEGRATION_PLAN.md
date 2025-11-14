# Agent-Lightning Token Caching Integration Plan

**Objective**: Integrate vLLM Agent-Lightning token caching into RAG-heavy agents for 60-80% latency reduction

**Timeline**: 3-4 days parallel execution
**Budget**: $0 (using existing infrastructure)
**Expected Impact**: 60-80% latency reduction on RAG operations (200-500ms → 40-100ms)

---

## Phase 1: Agent Mapping & Architecture Design (Day 1)

### Priority 1: RAG-Heavy Agents (Shane)
**Agent**: Shane (specialized code writing)
**Model**: Claude Sonnet 4.5 Haiku where possible
**MCP**: Context7 for library documentation
**Timeline**: 6-8 hours

#### Target Agents:
1. **Support Agent** (`agents/support_agent.py`)
   - Current: Direct RAG queries without caching
   - Integration: Cache customer support knowledge base token IDs
   - Expected speedup: 70-80% (most repetitive queries)
   - Cache hit rate target: 85%+

2. **Documentation Agent** (`agents/documentation_agent.py`)
   - Current: Re-tokenizes documentation on every lookup
   - Integration: Cache documentation section token IDs
   - Expected speedup: 75-85% (highly repetitive)
   - Cache hit rate target: 90%+

3. **Business Generation Agent** (`agents/business_generation_agent.py`)
   - Current: Recalls business templates without token caching
   - Integration: Cache business template token IDs
   - Expected speedup: 60-70% (moderate repetition)
   - Cache hit rate target: 70%+

#### Deliverables:
```
agents/support_agent.py                 (TokenCachedRAG integration)
agents/documentation_agent.py           (TokenCachedRAG integration)
agents/business_generation_agent.py     (TokenCachedRAG integration)
tests/test_support_agent_lightning.py   (unit tests)
tests/test_documentation_agent_lightning.py (unit tests)
tests/test_business_generation_agent_lightning.py (unit tests)
```

### Priority 2: QA & Testing Agents (Nova)
**Agent**: Nova (Vertex AI Agent Builder specialist)
**Model**: Claude Sonnet 4.5 Haiku where possible
**MCP**: Context7 for library documentation
**Timeline**: 6-8 hours

#### Target Agents:
1. **QA Agent** (`agents/qa_agent.py`)
   - Current: Regenerates test context on every run
   - Integration: Cache test template and fixture token IDs
   - Expected speedup: 65-75% (test generation)
   - Cache hit rate target: 75%+

2. **Code Review Agent** (`agents/code_review_agent.py`)
   - Current: Re-tokenizes code context for every review
   - Integration: Cache code pattern token IDs
   - Expected speedup: 60-70% (pattern matching)
   - Cache hit rate target: 70%+

3. **SE-Darwin Agent** (`agents/se_darwin_agent.py`)
   - Current: Evolution without token caching
   - Integration: Cache operator pattern token IDs
   - Expected speedup: 55-65% (operator selection)
   - Cache hit rate target: 65%+

#### Deliverables:
```
agents/qa_agent.py                      (TokenCachedRAG integration)
agents/code_review_agent.py             (TokenCachedRAG integration)
agents/se_darwin_agent.py               (TokenCachedRAG integration)
tests/test_qa_agent_lightning.py        (unit tests)
tests/test_code_review_agent_lightning.py (unit tests)
tests/test_se_darwin_agent_lightning.py (unit tests)
```

---

## Phase 2: Implementation (Day 1-2)

### Shane's Work (Support, Documentation, Business Generation)

**Integration Pattern**:
```python
from infrastructure.token_cached_rag import TokenCachedRAG, TokenCacheStats

class SupportAgent:
    def __init__(self, business_id: str = "default", enable_memory: bool = True):
        # ... existing init ...

        # Agent-Lightning token caching
        self.token_cached_rag = TokenCachedRAG(
            redis_client=self.redis_client,
            model_name="gpt-4o-mini",  # Fast tokenizer
            cache_ttl=3600,  # 1 hour cache
            max_cache_size_mb=100
        )

    async def answer_support_query(self, query: str) -> str:
        """Answer support query with token caching."""
        # Step 1: Retrieve cached token IDs
        token_ids, cache_stats = await self.token_cached_rag.retrieve_tokens(
            query=query,
            collection_name="support_kb",
            top_k=5
        )

        # Step 2: Generate response with cached tokens (NO retokenization)
        response = await self.token_cached_rag.generate_with_rag(
            query=query,
            context_token_ids=token_ids,
            max_tokens=500
        )

        # Step 3: Log cache performance
        logger.info(f"Cache hit rate: {cache_stats.hit_rate:.1f}%, "
                   f"Latency: {cache_stats.avg_hit_latency_ms:.0f}ms")

        return response
```

**Key Implementation Steps**:
1. Initialize `TokenCachedRAG` in agent `__init__`
2. Replace direct RAG calls with `retrieve_tokens()` + `generate_with_rag()`
3. Add cache statistics logging
4. Add cache warmup on agent initialization
5. Add cache invalidation on knowledge base updates

**Testing Requirements**:
- Unit tests for cache hit/miss scenarios
- Performance benchmarks (before/after latency)
- Cache hit rate validation (>70%)
- Memory usage validation (<100MB per agent)

### Nova's Work (QA, Code Review, SE-Darwin)

**Integration Pattern**:
```python
from infrastructure.token_cached_rag import TokenCachedRAG, TokenCacheStats

class QAAgent:
    def __init__(self, enable_memory: bool = True):
        # ... existing init ...

        # Agent-Lightning token caching for test templates
        self.token_cached_rag = TokenCachedRAG(
            redis_client=self.redis_client,
            model_name="gpt-4o-mini",
            cache_ttl=7200,  # 2 hours (test templates change less)
            max_cache_size_mb=150
        )

    async def generate_tests(self, code: str, test_type: str) -> List[str]:
        """Generate tests with token caching."""
        # Step 1: Retrieve cached test template token IDs
        template_query = f"test templates for {test_type}"
        token_ids, cache_stats = await self.token_cached_rag.retrieve_tokens(
            query=template_query,
            collection_name="test_templates",
            top_k=3
        )

        # Step 2: Generate tests with cached templates
        tests = await self.token_cached_rag.generate_with_rag(
            query=f"Generate {test_type} tests for:\n{code}",
            context_token_ids=token_ids,
            max_tokens=1000
        )

        # Step 3: Log performance
        logger.info(f"Test generation cache hit rate: {cache_stats.hit_rate:.1f}%")

        return tests.split("\n\n")
```

**Key Implementation Steps**:
1. Initialize `TokenCachedRAG` with test-specific configuration
2. Cache test templates, code patterns, and fixtures
3. Add cache warmup for common test types
4. Implement cache invalidation on template updates
5. Add performance monitoring for cache effectiveness

**Testing Requirements**:
- Unit tests for test template caching
- Performance benchmarks for test generation
- Cache hit rate validation (>65%)
- Memory usage validation (<150MB per agent)

---

## Phase 3: Audit & Testing (Day 2-3)

### Hudson Audits Shane's Work (Support, Documentation, Business Generation)
**Agent**: Hudson (specialized code review)
**Protocol**: AUDIT_PROTOCOL_V2
**Timeline**: 8-10 hours

#### Audit Checklist:
1. **Code Quality**:
   - [ ] Proper error handling for cache failures
   - [ ] Graceful fallback to non-cached RAG on Redis failure
   - [ ] Memory leak prevention (cache eviction)
   - [ ] Thread safety for concurrent cache access

2. **Performance**:
   - [ ] Latency benchmarks: 60-80% reduction validated
   - [ ] Cache hit rate: >70% on realistic workloads
   - [ ] Memory overhead: <100MB per agent
   - [ ] Redis connection pooling efficiency

3. **Integration**:
   - [ ] No breaking changes to existing API
   - [ ] Backward compatibility maintained
   - [ ] Memory integration still working
   - [ ] Observability/logging functional

4. **Testing**:
   - [ ] Unit tests cover cache hit/miss scenarios
   - [ ] Integration tests with Redis
   - [ ] Performance benchmarks automated
   - [ ] Edge cases handled (cache corruption, eviction)

#### Deliverables:
```
audits/lightning_integration_shane_audit.md     (Hudson's audit report)
audits/lightning_integration_shane_fixes.md     (Fix recommendations)
tests/integration/test_support_agent_cached.py  (integration tests)
tests/integration/test_doc_agent_cached.py      (integration tests)
tests/integration/test_bizgen_agent_cached.py   (integration tests)
benchmarks/lightning_performance_shane.json     (performance results)
```

#### Fix Protocol:
1. Hudson identifies issues using AUDIT_PROTOCOL_V2
2. Hudson creates fix recommendations with code examples
3. Shane reviews and implements fixes
4. Hudson re-audits until all checks pass
5. Final approval with performance validation

### Cora Audits Nova's Work (QA, Code Review, SE-Darwin)
**Agent**: Cora (AI agent orchestration specialist)
**Protocol**: AUDIT_PROTOCOL_V2
**Timeline**: 8-10 hours

#### Audit Checklist:
1. **Code Quality**:
   - [ ] Error handling for vLLM failures
   - [ ] Graceful degradation on cache unavailability
   - [ ] Cache eviction strategy for test templates
   - [ ] Concurrent test generation safety

2. **Performance**:
   - [ ] Latency benchmarks: 55-75% reduction validated
   - [ ] Cache hit rate: >65% for test generation
   - [ ] Memory overhead: <150MB per agent
   - [ ] vLLM inference efficiency

3. **Integration**:
   - [ ] QA Agent API unchanged
   - [ ] Code Review Agent compatibility
   - [ ] SE-Darwin evolution not disrupted
   - [ ] Observability metrics correct

4. **Testing**:
   - [ ] Unit tests for test template caching
   - [ ] Integration tests with vLLM
   - [ ] Performance benchmarks for test generation
   - [ ] Edge cases (template versioning, invalidation)

#### Deliverables:
```
audits/lightning_integration_nova_audit.md      (Cora's audit report)
audits/lightning_integration_nova_fixes.md      (Fix recommendations)
tests/integration/test_qa_agent_cached.py       (integration tests)
tests/integration/test_review_agent_cached.py   (integration tests)
tests/integration/test_darwin_agent_cached.py   (integration tests)
benchmarks/lightning_performance_nova.json      (performance results)
```

#### Fix Protocol:
1. Cora identifies issues using AUDIT_PROTOCOL_V2
2. Cora creates detailed fix recommendations
3. Nova reviews and implements fixes
4. Cora re-audits until all checks pass
5. Final approval with performance validation

---

## Phase 4: Integration Testing (Day 3-4)

### End-to-End Validation
**Owners**: Hudson + Cora (joint validation)
**Timeline**: 6-8 hours

#### Test Scenarios:
1. **Full Business Workflow with Token Caching**:
   - Run 20-minute workflow test
   - Measure cache hit rates across all agents
   - Validate 60-80% latency reduction
   - Check memory usage (<500MB total)

2. **Cache Warmup Performance**:
   - Cold start: Measure initial cache population
   - Warm cache: Validate hit rate >70%
   - Cache eviction: Test LRU eviction correctness

3. **Failure Recovery**:
   - Redis failure: Validate fallback to non-cached RAG
   - vLLM failure: Validate graceful degradation
   - Cache corruption: Validate cache rebuild

4. **Concurrent Load**:
   - 10 concurrent agents with token caching
   - Validate no race conditions
   - Check Redis connection pooling

#### Success Criteria:
- [ ] All 6 agents integrated successfully
- [ ] 60-80% latency reduction on cache hits
- [ ] >70% cache hit rate on realistic workloads
- [ ] <500MB total memory overhead
- [ ] Zero breaking changes to existing APIs
- [ ] 100% test pass rate (unit + integration)
- [ ] Performance benchmarks documented

---

## AUDIT_PROTOCOL_V2 Specification

### Hudson's Audit Process (Shane's Work)

```markdown
# AUDIT_PROTOCOL_V2: Lightning Integration Audit

## Audit Metadata
- Auditor: Hudson (Code Review Specialist)
- Auditee: Shane (Code Writing Specialist)
- Target: Support Agent, Documentation Agent, Business Generation Agent
- Date: [TIMESTAMP]
- Protocol: AUDIT_PROTOCOL_V2

## Audit Scope
1. Code Quality (40%)
2. Performance (30%)
3. Integration Safety (20%)
4. Testing Coverage (10%)

## Audit Findings

### Critical Issues (P0 - Must Fix Before Merge)
- [ ] Issue #1: [Description]
  - Location: `agents/support_agent.py:123`
  - Impact: Memory leak on cache eviction
  - Recommendation: Implement explicit cache cleanup
  - Code Example:
    ```python
    async def _cleanup_cache(self):
        await self.token_cached_rag.evict_lru(max_size_mb=100)
    ```

### High Priority (P1 - Must Fix Within 24h)
- [ ] Issue #2: [Description]
  - Location: `agents/documentation_agent.py:456`
  - Impact: No fallback on Redis failure
  - Recommendation: Add try-except with fallback

### Medium Priority (P2 - Fix Before Release)
- [ ] Issue #3: [Description]

### Low Priority (P3 - Nice to Have)
- [ ] Issue #4: [Description]

## Performance Validation
| Metric | Target | Actual | Pass? |
|--------|--------|--------|-------|
| Latency Reduction | 60-80% | 72% | ✅ |
| Cache Hit Rate | >70% | 78% | ✅ |
| Memory Overhead | <100MB | 85MB | ✅ |

## Testing Coverage
- Unit Tests: 45/45 passing
- Integration Tests: 12/12 passing
- Performance Benchmarks: 6/6 passing
- Coverage: 94%

## Final Verdict
- [ ] APPROVED (All P0/P1 issues resolved)
- [ ] APPROVED WITH CONDITIONS (P1 issues remain)
- [ ] REJECTED (P0 issues unresolved)

## Signatures
- Auditor: Hudson
- Auditee: Shane (acknowledged)
- Date: [TIMESTAMP]
```

### Cora's Audit Process (Nova's Work)

```markdown
# AUDIT_PROTOCOL_V2: Lightning Integration Audit

## Audit Metadata
- Auditor: Cora (AI Agent Orchestration Specialist)
- Auditee: Nova (Vertex AI Agent Builder)
- Target: QA Agent, Code Review Agent, SE-Darwin Agent
- Date: [TIMESTAMP]
- Protocol: AUDIT_PROTOCOL_V2

## Audit Scope
1. Agent Orchestration (40%)
2. Performance (30%)
3. Integration Safety (20%)
4. Testing Coverage (10%)

## Audit Findings

### Critical Issues (P0 - Must Fix Before Merge)
- [ ] Issue #1: [Description]
  - Location: `agents/qa_agent.py:234`
  - Impact: Race condition in concurrent test generation
  - Recommendation: Add async locks for cache access
  - Code Example:
    ```python
    self._cache_lock = asyncio.Lock()
    async with self._cache_lock:
        tokens = await self.token_cached_rag.retrieve_tokens(query)
    ```

### High Priority (P1 - Must Fix Within 24h)
- [ ] Issue #2: [Description]

### Medium Priority (P2 - Fix Before Release)
- [ ] Issue #3: [Description]

### Low Priority (P3 - Nice to Have)
- [ ] Issue #4: [Description]

## Performance Validation
| Metric | Target | Actual | Pass? |
|--------|--------|--------|-------|
| Latency Reduction | 55-75% | 68% | ✅ |
| Cache Hit Rate | >65% | 72% | ✅ |
| Memory Overhead | <150MB | 128MB | ✅ |

## Testing Coverage
- Unit Tests: 38/38 passing
- Integration Tests: 10/10 passing
- Performance Benchmarks: 6/6 passing
- Coverage: 91%

## Final Verdict
- [ ] APPROVED (All P0/P1 issues resolved)
- [ ] APPROVED WITH CONDITIONS (P1 issues remain)
- [ ] REJECTED (P0 issues unresolved)

## Signatures
- Auditor: Cora
- Auditee: Nova (acknowledged)
- Date: [TIMESTAMP]
```

---

## Agent Task Assignments

### Shane (Support, Documentation, Business Generation)
```bash
# Task: Integrate Agent-Lightning token caching into 3 agents
# Model: Claude Sonnet 4.5 Haiku (where possible)
# MCP: Context7 for library docs
# Timeline: 6-8 hours

# Commands:
claude-code --agent shane \
  --task "Integrate TokenCachedRAG into Support Agent" \
  --model haiku-4.5 \
  --mcp context7 \
  --files agents/support_agent.py \
  --reference infrastructure/token_cached_rag.py

claude-code --agent shane \
  --task "Integrate TokenCachedRAG into Documentation Agent" \
  --model haiku-4.5 \
  --mcp context7 \
  --files agents/documentation_agent.py

claude-code --agent shane \
  --task "Integrate TokenCachedRAG into Business Generation Agent" \
  --model haiku-4.5 \
  --mcp context7 \
  --files agents/business_generation_agent.py
```

### Nova (QA, Code Review, SE-Darwin)
```bash
# Task: Integrate Agent-Lightning token caching into 3 agents
# Model: Claude Sonnet 4.5 Haiku (where possible)
# MCP: Context7 for library docs
# Timeline: 6-8 hours

# Commands:
claude-code --agent nova \
  --task "Integrate TokenCachedRAG into QA Agent" \
  --model haiku-4.5 \
  --mcp context7 \
  --files agents/qa_agent.py \
  --reference infrastructure/token_cached_rag.py

claude-code --agent nova \
  --task "Integrate TokenCachedRAG into Code Review Agent" \
  --model haiku-4.5 \
  --mcp context7 \
  --files agents/code_review_agent.py

claude-code --agent nova \
  --task "Integrate TokenCachedRAG into SE-Darwin Agent" \
  --model haiku-4.5 \
  --mcp context7 \
  --files agents/se_darwin_agent.py
```

### Hudson (Audit Shane's Work)
```bash
# Task: Audit Shane's Lightning integration
# Protocol: AUDIT_PROTOCOL_V2
# Timeline: 8-10 hours

# Commands:
claude-code --agent hudson \
  --task "Audit Lightning integration in Support/Doc/BizGen agents" \
  --protocol AUDIT_PROTOCOL_V2 \
  --files agents/support_agent.py agents/documentation_agent.py agents/business_generation_agent.py \
  --output audits/lightning_integration_shane_audit.md
```

### Cora (Audit Nova's Work)
```bash
# Task: Audit Nova's Lightning integration
# Protocol: AUDIT_PROTOCOL_V2
# Timeline: 8-10 hours

# Commands:
claude-code --agent cora \
  --task "Audit Lightning integration in QA/Review/Darwin agents" \
  --protocol AUDIT_PROTOCOL_V2 \
  --files agents/qa_agent.py agents/code_review_agent.py agents/se_darwin_agent.py \
  --output audits/lightning_integration_nova_audit.md
```

---

## Expected Outcomes

### Performance Improvements
| Agent | Current Latency | Expected Latency | Reduction |
|-------|----------------|------------------|-----------|
| Support Agent | 450ms | 90-135ms | 70-80% |
| Documentation Agent | 380ms | 57-95ms | 75-85% |
| Business Generation Agent | 520ms | 156-208ms | 60-70% |
| QA Agent | 600ms | 210-270ms | 65-75% |
| Code Review Agent | 480ms | 144-192ms | 60-70% |
| SE-Darwin Agent | 550ms | 192-247ms | 55-65% |

### Cache Hit Rates (After Warmup)
- Support Agent: 85%+ (highly repetitive queries)
- Documentation Agent: 90%+ (static documentation)
- Business Generation Agent: 70%+ (template reuse)
- QA Agent: 75%+ (common test patterns)
- Code Review Agent: 70%+ (code pattern reuse)
- SE-Darwin Agent: 65%+ (operator selection)

### Memory Overhead
- Per-agent overhead: 85-150MB
- Total system overhead: <500MB (6 agents)
- Redis cache size: ~300MB (10K documents)

### Business Impact
- **60-80% faster support responses** → Better customer satisfaction
- **75-85% faster documentation lookups** → Faster development
- **60-70% faster business idea generation** → More ideas per minute
- **65-75% faster test generation** → Faster CI/CD
- **60-70% faster code reviews** → Faster PRs
- **55-65% faster evolution** → Better agent improvement

---

## Risk Mitigation

### Technical Risks
1. **Redis Failure**:
   - Mitigation: Graceful fallback to non-cached RAG
   - Test: Integration tests with Redis down

2. **vLLM Unavailable**:
   - Mitigation: Fallback to OpenAI/Anthropic APIs
   - Test: vLLM service unavailability scenario

3. **Cache Poisoning**:
   - Mitigation: Cache versioning + TTL
   - Test: Cache invalidation on knowledge base updates

4. **Memory Leaks**:
   - Mitigation: LRU eviction + max cache size limits
   - Test: Long-running stress tests

### Operational Risks
1. **Breaking Changes**:
   - Mitigation: Backward compatibility maintained
   - Test: All existing tests must pass

2. **Performance Regression**:
   - Mitigation: Automated performance benchmarks
   - Test: Before/after latency comparison

3. **Cache Cold Start**:
   - Mitigation: Proactive cache warmup on agent init
   - Test: Cold start performance tests

---

## Success Metrics

### Phase 1 Success (Design)
- [ ] Agent mapping complete
- [ ] Architecture design approved
- [ ] Integration patterns documented

### Phase 2 Success (Implementation)
- [ ] 6 agents integrated
- [ ] Unit tests passing (100%)
- [ ] Code quality validated

### Phase 3 Success (Audit)
- [ ] Hudson audit complete (P0/P1 issues resolved)
- [ ] Cora audit complete (P0/P1 issues resolved)
- [ ] Integration tests passing (100%)

### Phase 4 Success (Validation)
- [ ] 60-80% latency reduction validated
- [ ] >70% cache hit rate achieved
- [ ] <500MB memory overhead
- [ ] Zero breaking changes
- [ ] Performance benchmarks published

---

## Next Steps

1. **Approve this plan** (User confirmation)
2. **Launch Shane + Nova in parallel** (Day 1)
3. **Monitor progress** (Daily check-ins)
4. **Launch Hudson + Cora audits** (Day 2-3)
5. **Fix issues** (Day 3)
6. **Final validation** (Day 3-4)
7. **Merge to production** (Day 4)

---

**Ready to proceed?** Confirm and I'll launch Shane and Nova in parallel to begin Agent-Lightning integration! ⚡
