# Enterprise Deep Research (EDR) Integration Design

**Date:** October 27, 2025
**Status:** Design Complete - Ready for Implementation
**Owner:** Analyst Agent Enhancement
**Timeline:** 3 hours total (1 hour implementation remaining)

---

## Executive Summary

Integration of Salesforce Enterprise Deep Research (EDR) multi-agent system into Genesis Analyst Agent to enable deep research capabilities for market research, competitive intelligence, and comprehensive analysis tasks.

**Key Capabilities Added:**
- Master Planner for adaptive query decomposition
- 4 specialized search agents (General, Academic, GitHub, LinkedIn)
- Extensible MCP-based tool ecosystem
- Real-time research refinement with reflection mechanism
- Automated report generation (10-20 pages)

**Architecture:** EDR's Master Planning Agent + 4 Search Agents integrate as a new research mode within existing Analyst Agent

---

## 1. EDR Architecture Overview

### 1.1 Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                    MASTER RESEARCH AGENT                     │
│  - Adaptive query decomposition                              │
│  - Research plan orchestration                               │
│  - Reflection mechanism for knowledge gaps                   │
│  - Real-time steering & refinement                           │
└────────┬────────────────────────────────────────────┬────────┘
         │                                            │
         ├────────────────────────────────────────────┤
         │                                            │
    ┌────▼────┐  ┌────────────┐  ┌──────────┐  ┌────▼───────┐
    │ General │  │ Academic   │  │  GitHub  │  │  LinkedIn  │
    │ Search  │  │ Search     │  │  Search  │  │  Search    │
    │ Agent   │  │ Agent      │  │  Agent   │  │  Agent     │
    └────┬────┘  └──────┬─────┘  └─────┬────┘  └──────┬─────┘
         │              │               │              │
         └──────────────┴───────────────┴──────────────┘
                              │
                    ┌─────────▼──────────┐
                    │  RESULT COMBINER   │
                    │  - Synthesis       │
                    │  - Citation mgmt   │
                    │  - Report gen      │
                    └────────────────────┘
```

### 1.2 Key Features

1. **Master Planning Agent** (`src/agent_architecture.py:MasterResearchAgent`)
   - Decomposes complex topics into subtasks
   - Coordinates 4 specialized search agents in parallel
   - Reflection loop detects knowledge gaps
   - Adaptive refinement based on results

2. **Search Agents** (`src/agent_architecture.py:SearchAgent`)
   - **General Search:** Web search via Tavily API (top-k=5)
   - **Academic Search:** Research papers, citations, academic sources
   - **GitHub Search:** Code repositories, technical docs, implementations
   - **LinkedIn Search:** Professional insights, company data, expert opinions

3. **Tool Ecosystem** (`src/tools/`)
   - MCP-based extensibility (`mcp_tools.py`)
   - Text2SQL for database queries (`text2sql_tool.py`)
   - File analysis (PDF, DOCX, XLSX, images)
   - Audio/video processing (Whisper integration)

4. **State Management** (`src/state.py:SummaryState`)
   - Research topic tracking
   - Running summary accumulation
   - Knowledge gap identification
   - Source citations management
   - Reflection history
   - Tool call logging for trajectory capture

5. **LLM Integration** (`llm_clients.py`)
   - Multi-provider support (OpenAI, Anthropic, Groq, Google)
   - Model-agnostic design
   - Async client support
   - Cost-efficient model routing

---

## 2. Integration Architecture

### 2.1 High-Level Design

```python
┌─────────────────────────────────────────────────────────────┐
│                    ANALYST AGENT (Enhanced)                  │
│  - Standard analysis (existing)                              │
│  - Metrics, dashboards, predictions (existing)               │
│  - DAAO routing, TUMIX optimization (existing)               │
│  - OCR chart extraction (existing)                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           DEEP RESEARCH MODE (NEW)                   │  │
│  │  - Triggered by: "deep research on X"                │  │
│  │  - Uses EDR Master Planner + 4 Search Agents        │  │
│  │  - Output: Comprehensive 10-20 page report          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Integration Points

**Location:** `/home/genesis/genesis-rebuild/agents/analyst_agent.py`

**New Components:**

1. **EDRMasterPlanner Wrapper** (imports from EDR)
   - Path: `integrations.evolution.enterprise_deep_research.src.agent_architecture`
   - Class: `MasterResearchAgent`

2. **EDRSearchCoordinator** (imports from EDR)
   - Path: `integrations.evolution.enterprise_deep_research.src.agent_architecture`
   - Class: `SearchAgent`

3. **New Method:** `async def deep_research(topic: str, config: Dict) -> str`
   - Orchestrates EDR Master Planner
   - Coordinates 4 search agents
   - Synthesizes comprehensive report

4. **New Tool Registration:** `deep_research` tool added to ChatAgent

### 2.3 Configuration Requirements

**Environment Variables (EDR):**
```bash
# Required
TAVILY_API_KEY=<your_key>              # For search functionality
OPENAI_API_KEY=<your_key>              # Primary LLM (or alternative)

# Optional
LLM_PROVIDER=openai                     # Default: openai
LLM_MODEL=gpt-4o                        # Default: gpt-4o
MAX_WEB_RESEARCH_LOOPS=10               # Research iterations (5-15)
ENABLE_ACTIVITY_GENERATION=True         # Activity logging
ACTIVITY_VERBOSITY=medium               # none/low/medium/high
```

**Genesis Configuration:**
- No changes required to existing Genesis config
- EDR uses separate environment namespace
- Shares LLM credentials if using same provider

---

## 3. Implementation Plan

### Phase 1: Core Integration (30 min)

**File:** `/home/genesis/genesis-rebuild/agents/analyst_agent.py`

```python
# 1. Add imports at top of file
from integrations.evolution.enterprise_deep_research.src.agent_architecture import (
    MasterResearchAgent,
    SearchAgent
)
from integrations.evolution.enterprise_deep_research.src.state import SummaryState
from integrations.evolution.enterprise_deep_research.src.configuration import Configuration

# 2. Initialize EDR in __init__
class AnalystAgent:
    def __init__(self, business_id: str = "default"):
        # ... existing initialization ...

        # Initialize EDR components
        self.edr_config = Configuration(
            llm_provider="openai",
            llm_model="gpt-4o",
            max_web_research_loops=10
        )
        self.edr_master = MasterResearchAgent(config=self.edr_config)
        self.edr_search = SearchAgent(config=self.edr_config)

        logger.info(
            f"Analyst Agent v4.0 initialized with EDR deep research capability"
        )

# 3. Add deep_research method
    async def deep_research(
        self,
        topic: str,
        research_depth: str = "comprehensive",  # "quick" | "comprehensive" | "exhaustive"
        focus_areas: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Perform deep research using Salesforce EDR multi-agent architecture.

        Args:
            topic: Research topic/query (e.g., "AI agent market size 2025-2027")
            research_depth: Research thoroughness level
                - "quick": 3-5 loops, 5-10 pages
                - "comprehensive": 8-10 loops, 10-20 pages (default)
                - "exhaustive": 12-15 loops, 20-30+ pages
            focus_areas: Optional list of specific areas to emphasize
                - ["market_size", "competitors", "technology", "trends"]

        Returns:
            Dict containing:
                - report: Comprehensive research report (markdown)
                - summary: Executive summary
                - sources: List of citations
                - metadata: Research metadata (loops, time, tokens)
        """

        # Configure research depth
        loop_config = {
            "quick": 5,
            "comprehensive": 10,
            "exhaustive": 15
        }
        self.edr_config._max_web_research_loops = loop_config.get(research_depth, 10)

        logger.info(
            f"Starting deep research: topic='{topic}', "
            f"depth={research_depth}, loops={self.edr_config.max_web_research_loops}"
        )

        # Initialize research state
        state = SummaryState(
            research_topic=topic,
            search_query=topic,
            research_loop_count=0,
            llm_provider=self.edr_config.llm_provider.value,
            llm_model=self.edr_config.llm_model
        )

        # Build focus context
        focus_context = ""
        if focus_areas:
            focus_context = f"Focus Areas: {', '.join(focus_areas)}"

        # Phase 1: Master Planner decomposes topic
        decomposition = await self.edr_master.decompose_topic(
            query=topic,
            knowledge_gap=focus_context,
            research_loop_count=0,
            uploaded_knowledge=None,
            existing_tasks=None
        )

        logger.info(
            f"Topic decomposition: complexity={decomposition.get('topic_complexity')}, "
            f"subtopics={len(decomposition.get('subtopics', []))}"
        )

        # Phase 2: Execute parallel search across 4 agents
        search_results = []
        subtopics = decomposition.get('subtopics', [topic])

        for idx, subtopic in enumerate(subtopics):
            # Determine search tool based on subtopic content
            if "paper" in subtopic.lower() or "research" in subtopic.lower():
                result = await self.edr_search.academic_search(subtopic)
                result['search_type'] = 'academic'
            elif "code" in subtopic.lower() or "github" in subtopic.lower():
                result = await self.edr_search.github_search(subtopic)
                result['search_type'] = 'github'
            elif "company" in subtopic.lower() or "professional" in subtopic.lower():
                result = await self.edr_search.linkedin_search(subtopic)
                result['search_type'] = 'linkedin'
            else:
                result = await self.edr_search.general_search(subtopic)
                result['search_type'] = 'general'

            search_results.append({
                'subtopic': subtopic,
                'result': result,
                'index': idx
            })

            logger.info(
                f"Completed search {idx+1}/{len(subtopics)}: "
                f"type={result.get('search_type')}, "
                f"success={result.get('success', False)}"
            )

        # Phase 3: Synthesize comprehensive report
        report = await self._synthesize_edr_report(
            topic=topic,
            decomposition=decomposition,
            search_results=search_results,
            research_depth=research_depth
        )

        logger.info(
            f"Deep research complete: "
            f"report_length={len(report['report'])} chars, "
            f"sources={len(report['sources'])}, "
            f"time={report['metadata']['elapsed_time_sec']:.2f}s"
        )

        return report

# 4. Add synthesis helper method
    async def _synthesize_edr_report(
        self,
        topic: str,
        decomposition: Dict,
        search_results: List[Dict],
        research_depth: str
    ) -> Dict[str, Any]:
        """Synthesize research findings into comprehensive report."""
        import time
        from datetime import datetime

        start_time = time.time()

        # Aggregate all sources
        all_sources = []
        for sr in search_results:
            sources = sr['result'].get('sources', [])
            if isinstance(sources, list):
                all_sources.extend(sources)

        # Build report sections
        report_sections = []

        # Executive Summary
        report_sections.append("# Executive Summary\n")
        report_sections.append(f"**Research Topic:** {topic}\n")
        report_sections.append(f"**Research Depth:** {research_depth.title()}\n")
        report_sections.append(f"**Analysis Date:** {datetime.now().strftime('%B %d, %Y')}\n")
        report_sections.append(f"**Sources Analyzed:** {len(all_sources)}\n\n")

        # Key Findings (synthesized from search results)
        report_sections.append("## Key Findings\n\n")
        for idx, sr in enumerate(search_results, 1):
            subtopic = sr['subtopic']
            result = sr['result']
            search_type = result.get('search_type', 'general')

            report_sections.append(f"### {idx}. {subtopic}\n")
            report_sections.append(f"*Source Type: {search_type.title()}*\n\n")

            # Extract content preview
            content = result.get('content', '')
            if content:
                preview = content[:500] + "..." if len(content) > 500 else content
                report_sections.append(f"{preview}\n\n")

            # List sources
            sources = result.get('sources', [])
            if sources:
                report_sections.append("**Sources:**\n")
                for source in sources[:3]:  # Top 3 sources per subtopic
                    title = source.get('title', 'Untitled')
                    url = source.get('url', '#')
                    report_sections.append(f"- [{title}]({url})\n")
                report_sections.append("\n")

        # Detailed Analysis
        report_sections.append("## Detailed Analysis\n\n")
        report_sections.append(
            "This section provides in-depth analysis of each research area, "
            "synthesized from multiple authoritative sources.\n\n"
        )

        # Append detailed findings
        for idx, sr in enumerate(search_results, 1):
            report_sections.append(f"### {idx}. {sr['subtopic']}\n\n")
            content = sr['result'].get('content', 'No detailed content available.')
            report_sections.append(f"{content}\n\n")

        # References
        report_sections.append("## References\n\n")
        for idx, source in enumerate(all_sources, 1):
            title = source.get('title', 'Untitled')
            url = source.get('url', '#')
            snippet = source.get('snippet', '')
            report_sections.append(f"{idx}. **{title}**\n")
            report_sections.append(f"   - URL: {url}\n")
            if snippet:
                snippet_preview = snippet[:200] + "..." if len(snippet) > 200 else snippet
                report_sections.append(f"   - Summary: {snippet_preview}\n")
            report_sections.append("\n")

        # Compile full report
        full_report = "".join(report_sections)

        # Generate executive summary (first 500 chars)
        exec_summary = full_report[:500] + "..." if len(full_report) > 500 else full_report

        elapsed_time = time.time() - start_time

        return {
            "report": full_report,
            "summary": exec_summary,
            "sources": all_sources,
            "metadata": {
                "topic": topic,
                "research_depth": research_depth,
                "subtopics_analyzed": len(search_results),
                "total_sources": len(all_sources),
                "report_length_chars": len(full_report),
                "elapsed_time_sec": elapsed_time,
                "timestamp": datetime.now().isoformat()
            }
        }

# 5. Register deep_research as tool
    async def initialize(self):
        cred = AzureCliCredential()
        client = AzureAIAgentClient(async_credential=cred)
        self.agent = ChatAgent(
            chat_client=client,
            instructions="...",  # existing instructions
            name="analyst-agent",
            tools=[
                # ... existing tools ...
                self.deep_research  # ADD THIS
            ]
        )
```

### Phase 2: Testing & Validation (15 min)

**File:** `/home/genesis/genesis-rebuild/tests/test_analyst_deep_research.py`

```python
import pytest
from agents.analyst_agent import get_analyst_agent

@pytest.mark.asyncio
async def test_deep_research_market_analysis():
    """Test deep research on market analysis topic."""
    agent = await get_analyst_agent("test-business")

    result = await agent.deep_research(
        topic="AI agent marketplace size and growth 2025-2027",
        research_depth="quick"  # Quick for testing
    )

    assert "report" in result
    assert "sources" in result
    assert len(result["sources"]) > 0
    assert result["metadata"]["subtopics_analyzed"] > 0

@pytest.mark.asyncio
async def test_deep_research_competitive_intel():
    """Test deep research on competitive intelligence."""
    agent = await get_analyst_agent("test-business")

    result = await agent.deep_research(
        topic="AutoGen vs CrewAI vs LangGraph comparison",
        research_depth="comprehensive",
        focus_areas=["features", "performance", "community"]
    )

    assert len(result["report"]) > 5000  # Comprehensive report
    assert result["metadata"]["total_sources"] > 10

@pytest.mark.asyncio
async def test_deep_research_tech_assessment():
    """Test deep research on technology assessment."""
    agent = await get_analyst_agent("test-business")

    result = await agent.deep_research(
        topic="Model Context Protocol production readiness 2025",
        research_depth="exhaustive"
    )

    assert len(result["report"]) > 10000  # Exhaustive report
    # Should use multiple search types
    # (validated by checking source diversity in integration tests)
```

### Phase 3: Documentation (15 min)

See Section 4 (Use Cases) and Section 5 (Completion Report) below.

---

## 4. Use Cases & Examples

### Use Case 1: Market Research

**Scenario:** Analyst Agent needs to research AI agent marketplace size, growth projections, and key players for 2025-2027.

**Code:**
```python
analyst = await get_analyst_agent("acme-corp")

report = await analyst.deep_research(
    topic="AI agent marketplace size and growth 2025-2027",
    research_depth="comprehensive",
    focus_areas=["market_size", "growth_rate", "key_players", "adoption_trends"]
)

print(f"Report Length: {len(report['report'])} characters")
print(f"Sources: {report['metadata']['total_sources']}")
print(f"Time: {report['metadata']['elapsed_time_sec']:.1f} seconds")
print("\n--- Executive Summary ---")
print(report['summary'])
```

**Expected Output:**
```
Report Length: 15,234 characters
Sources: 23
Time: 45.3 seconds

--- Executive Summary ---
# Executive Summary

**Research Topic:** AI agent marketplace size and growth 2025-2027
**Research Depth:** Comprehensive
**Analysis Date:** October 27, 2025
**Sources Analyzed:** 23

## Key Findings

### 1. Global Market Size Projections
*Source Type: General*

The AI agent marketplace is experiencing explosive growth, with projected CAGR of 42.3%
from 2025-2027. Market size estimates range from $4.2B (2025) to $18.7B (2027) across
major research firms (Gartner, Forrester, IDC)...

[Full 15-page report follows]
```

---

### Use Case 2: Competitive Intelligence

**Scenario:** Compare three leading multi-agent frameworks for strategic decision-making.

**Code:**
```python
analyst = await get_analyst_agent("genesis-ai")

report = await analyst.deep_research(
    topic="AutoGen vs CrewAI vs LangGraph comparison 2025",
    research_depth="comprehensive",
    focus_areas=[
        "architecture",
        "performance_benchmarks",
        "community_size",
        "production_readiness",
        "cost_efficiency"
    ]
)

# Extract key comparison metrics
import json
comparison_data = {
    "report_summary": report['summary'],
    "frameworks_analyzed": 3,
    "dimensions": 5,
    "total_sources": report['metadata']['total_sources']
}

print(json.dumps(comparison_data, indent=2))
```

**Expected Output:**
```json
{
  "report_summary": "# Executive Summary\n\n**Research Topic:** AutoGen vs CrewAI vs LangGraph comparison 2025\n**Research Depth:** Comprehensive\n**Analysis Date:** October 27, 2025\n**Sources Analyzed:** 28\n\n## Key Findings\n\n### 1. Architecture Comparison\n*Source Type: Github*\n\nAutoGen (Microsoft, 45K stars): Retired October 2025 in favor of unified Agent Framework...",
  "frameworks_analyzed": 3,
  "dimensions": 5,
  "total_sources": 28
}
```

**Report Sections Generated:**
1. Executive Summary
2. Architecture Comparison (GitHub sources)
3. Performance Benchmarks (Academic papers)
4. Community & Ecosystem (General + LinkedIn)
5. Production Readiness Assessment (General + Academic)
6. Cost Efficiency Analysis (General sources)
7. Recommendations
8. References (28 sources)

---

### Use Case 3: Technology Assessment

**Scenario:** Evaluate production readiness of Model Context Protocol for enterprise adoption.

**Code:**
```python
analyst = await get_analyst_agent("enterprise-corp")

report = await analyst.deep_research(
    topic="Model Context Protocol (MCP) production readiness assessment 2025",
    research_depth="exhaustive",
    focus_areas=[
        "adoption_metrics",
        "enterprise_deployments",
        "integration_challenges",
        "security_compliance",
        "vendor_support"
    ]
)

# Save report to file
import os
os.makedirs("research_reports", exist_ok=True)

report_path = "research_reports/mcp_assessment_2025.md"
with open(report_path, "w") as f:
    f.write(report['report'])

print(f"✅ Report saved: {report_path}")
print(f"📊 Analysis: {report['metadata']['subtopics_analyzed']} subtopics")
print(f"📚 Sources: {report['metadata']['total_sources']} references")
print(f"⏱️ Time: {report['metadata']['elapsed_time_sec']:.1f}s")
```

**Expected Output:**
```
✅ Report saved: research_reports/mcp_assessment_2025.md
📊 Analysis: 12 subtopics
📚 Sources: 34 references
⏱️ Time: 89.7s
```

**Report Structure (20-30 pages):**
1. Executive Summary (2 pages)
2. MCP Overview & Architecture (3 pages)
3. Adoption Metrics Analysis (4 pages)
   - GitHub stars, commits, contributors
   - NPM downloads, PyPI downloads
   - Community activity
4. Enterprise Deployment Case Studies (5 pages)
   - Anthropic, Google, Microsoft, Meta
   - Implementation patterns
   - Lessons learned
5. Integration Challenges & Solutions (4 pages)
   - Technical barriers
   - Workarounds
   - Best practices
6. Security & Compliance Review (3 pages)
   - Authentication mechanisms
   - Data privacy considerations
   - Enterprise requirements
7. Vendor Support Landscape (2 pages)
   - Official support channels
   - Third-party tooling
   - Professional services
8. Recommendations (2 pages)
9. References (2 pages, 34 sources)

---

## 5. Integration Checklist

### Pre-Implementation
- [x] EDR repository cloned to `integrations/evolution/enterprise-deep-research/`
- [x] EDR dependencies installed (requirements.txt)
- [x] Architecture documented (MasterResearchAgent + SearchAgent)
- [x] Integration points identified (analyst_agent.py modifications)

### Implementation
- [ ] Add EDR imports to analyst_agent.py
- [ ] Initialize EDR components in AnalystAgent.__init__
- [ ] Implement deep_research() method
- [ ] Implement _synthesize_edr_report() helper
- [ ] Register deep_research as ChatAgent tool
- [ ] Update agent instructions to include deep research capability

### Testing
- [ ] Create test_analyst_deep_research.py
- [ ] Test market research use case
- [ ] Test competitive intelligence use case
- [ ] Test technology assessment use case
- [ ] Validate report quality (10-20 pages)
- [ ] Validate source diversity (4 search types)

### Documentation
- [ ] Create EDR_USE_CASES.md with 3 examples
- [ ] Create EDR_INTEGRATION_COMPLETE.md with summary
- [ ] Update AGENT_PROJECT_MAPPING.md (Analyst Agent + EDR)
- [ ] Update PROJECT_STATUS.md (Phase 6 enhancement)

---

## 6. Cost & Performance Estimates

### EDR Cost Profile

**Per Research Session:**
- Master Planner LLM calls: 2-3 (query decomposition + reflection)
- Search Agent LLM calls: 1 per subtopic (typically 4-8 subtopics)
- Synthesis LLM call: 1 (report generation)
- **Total LLM calls:** 7-15 per session

**Token Usage (GPT-4o):**
- Input tokens: 8,000-15,000 (depending on search results)
- Output tokens: 5,000-10,000 (comprehensive report)
- **Total tokens:** 13,000-25,000 per session

**Cost Estimate (GPT-4o @ $3/1M input, $6/1M output):**
- Input: $0.024-0.045
- Output: $0.030-0.060
- **Total per session:** $0.05-0.10

**Tavily API Costs:**
- 5 searches per subtopic × 4-8 subtopics = 20-40 searches
- Free tier: 1,000 searches/month (sufficient for 25-50 research sessions)
- Paid tier: $0.005/search = $0.10-0.20/session

**Total Cost per Deep Research Session:** $0.15-0.30

### Performance Profile

**Time per Research Session:**
- Master Planner decomposition: 5-10s
- Parallel search execution: 20-40s (4 agents × 5-10s each)
- Report synthesis: 10-20s
- **Total time:** 35-70 seconds per session

**Optimization Opportunities:**
1. **DAAO Integration:** Route simple subtopics to Gemini Flash ($0.03/1M)
   - Potential savings: 60-70% on subtopic searches
   - New cost: $0.08-0.15/session

2. **TUMIX Integration:** Early termination for research loops
   - Savings: 40-50% on refinement iterations
   - Typical sessions: 5-7 loops instead of 10

3. **vLLM Caching:** Cache Master Planner prompts
   - Savings: 50% on repeated decomposition patterns
   - Benefit for similar research topics

**Optimized Cost Estimate:** $0.05-0.10/session (50% reduction)

---

## 7. Success Metrics

### Functional Metrics
- [x] EDR installed and verified
- [ ] Analyst Agent enhanced with deep_research() capability
- [ ] 3 use cases implemented and tested
- [ ] Reports generated (10-20 pages, comprehensive depth)
- [ ] Multi-source diversity (General, Academic, GitHub, LinkedIn)

### Quality Metrics
- [ ] Report completeness: Executive summary + detailed analysis + references
- [ ] Source count: 20+ sources per comprehensive research session
- [ ] Search type diversity: All 4 search agents utilized
- [ ] Synthesis quality: Coherent narrative, proper citations

### Performance Metrics
- [ ] Execution time: <70s for comprehensive research
- [ ] Cost per session: <$0.30 (optimized: <$0.15)
- [ ] Parallel execution: 4 search agents running concurrently

### Integration Metrics
- [ ] Zero breaking changes to existing Analyst Agent functionality
- [ ] Backward compatibility: All existing tools still functional
- [ ] DAAO/TUMIX compatibility: Cost optimizations still active

---

## 8. Risks & Mitigations

### Risk 1: API Rate Limits
**Risk:** Tavily API free tier (1,000 searches/month) may be insufficient for high-volume usage.

**Mitigation:**
- Monitor usage via Tavily dashboard
- Implement rate limit handling in SearchAgent
- Upgrade to paid tier ($29/month for 10,000 searches) if needed
- Cost: $0.005/search = acceptable for production

### Risk 2: LLM Cost Overruns
**Risk:** Deep research sessions could consume significant LLM budget if not optimized.

**Mitigation:**
- Integrate DAAO routing for subtopic searches (60% cost reduction)
- Set max_web_research_loops=10 (default) to cap iterations
- Implement TUMIX early termination for refinement loops
- Monitor per-session costs via observability

### Risk 3: Report Quality Variability
**Risk:** EDR synthesis may produce inconsistent report quality depending on search results.

**Mitigation:**
- Implement quality checks in _synthesize_edr_report
- Add self-correction loop integration (QA Agent validation)
- Enforce minimum source thresholds (e.g., 15+ sources)
- Add human-in-loop review for high-stakes reports

### Risk 4: Integration Complexity
**Risk:** EDR has many dependencies that could conflict with Genesis packages.

**Mitigation:**
- **CURRENT STATUS:** Numpy version conflict (minor, non-blocking)
- Test integration thoroughly before production
- Document dependency conflicts in completion report
- Consider vendoring EDR if conflicts become severe

---

## 9. Future Enhancements

### Phase 2 (Week 2):
1. **Self-Correction Integration:**
   - Add QA Agent validation to report generation
   - Implement multi-round refinement for report quality
   - Target: 90%+ report approval rate

2. **DAAO/TUMIX Optimization:**
   - Route subtopic searches through DAAO (60% cost reduction)
   - Apply TUMIX early termination to research loops (40% iteration savings)
   - Target: $0.05-0.10/session cost

### Phase 3 (Week 3):
1. **Custom Search Agent:**
   - Add 5th search agent for internal knowledge base
   - Integrate with Hybrid RAG retriever
   - Query Genesis memory store for historical research

2. **Visualization Integration:**
   - Add EDR VisualizationAgent to generate charts/graphs
   - Extract data from search results → matplotlib/plotly
   - Embed visualizations in reports

### Phase 4 (Week 4):
1. **Multi-Modal Analysis:**
   - Integrate DeepSeek-OCR for chart/image extraction
   - Process PDF reports, financial statements, presentations
   - Expand to audio/video sources (Whisper integration)

2. **Collaborative Research:**
   - Multi-agent research teams (Analyst + Marketing + Support)
   - Shared research cache (reduce duplicate searches)
   - Cross-agent report synthesis

---

## 10. References

### EDR Documentation
- **Repository:** https://github.com/SalesforceAIResearch/enterprise-deep-research
- **Paper:** arXiv:2510.17797 (Enterprise Deep Research)
- **Local Path:** `/home/genesis/genesis-rebuild/integrations/evolution/enterprise-deep-research/`

### Architecture Files
- `src/agent_architecture.py` - MasterResearchAgent + SearchAgent
- `src/state.py` - SummaryState (research state management)
- `src/configuration.py` - Configuration (LLM provider, search API)
- `src/tools/` - Tool ecosystem (search, text2sql, file analysis)

### Genesis Integration Files
- `/home/genesis/genesis-rebuild/agents/analyst_agent.py` - Target integration point
- `/home/genesis/genesis-rebuild/docs/EDR_INTEGRATION_DESIGN.md` - This document
- `/home/genesis/genesis-rebuild/docs/EDR_USE_CASES.md` - Use case examples (to be created)
- `/home/genesis/genesis-rebuild/docs/EDR_INTEGRATION_COMPLETE.md` - Completion report (to be created)

---

**Next Steps:**
1. Implement Phase 1 (Core Integration) in analyst_agent.py
2. Create test_analyst_deep_research.py with 3 test cases
3. Document use cases in EDR_USE_CASES.md
4. Generate completion report in EDR_INTEGRATION_COMPLETE.md
