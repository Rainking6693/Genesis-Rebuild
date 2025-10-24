---
title: AI Coding Agent Instructions
category: Reports
dg-publish: true
publish: true
tags: []
source: .github/copilot-instructions.md
exported: '2025-10-24T22:05:26.843945'
---

# AI Coding Agent Instructions

## Project Overview
This is a recursive multi-agent AI system built on Microsoft Agent Framework and Azure AI that autonomously spawns, manages, and optimizes businesses. The system uses a 6-layer architecture where agents can create and manage other agent businesses.

## Key Project Patterns

### 1. Agent Development Workflow
- **Agent Assignment Check**: Always check `AGENT_PROJECT_MAPPING.md` first to verify which agent should implement a feature
- **Code Review Flow**: Changes require Cora/Hudson audit (8.5/10+) and Alex E2E tests (9/10+)
- **Testing Standards**: Refer to `TESTING_STANDARDS_UPDATE_SUMMARY.md` for mandatory testing requirements

### 2. Core Architecture Components
```python
# Example agent initialization from agents/darwin_agent.py
darwin = get_darwin_agent(
    agent_name='spec_agent',
    initial_code_path='agents/spec_agent.py',
    max_generations=3,
    population_size=2
)
```

### 3. Development Conventions
- Use context7 MCP protocol for agent communication
- Implement triple-layer orchestration (HTDAG+HALO+AOP) for agent management
- Follow DAAO optimization patterns for 48% cost reduction
- Always update PROJECT_STATUS.md after completing work

### 4. Critical Integration Points
- A2A Protocol: Agent-to-agent communication (`a2a_service.py`)
- Darwin Evolution: Self-improvement engine (`agents/darwin_agent.py`)
- WaltzRL Safety: Core security layer (see `RESEARCH_UPDATE_OCT_2025.md`)

### 5. Testing Workflow
```bash
# Component testing
pytest tests/test_darwin_layer2.py::TestCodeSandbox -v

# Layer-specific testing
pytest tests/test_darwin_layer2.py -v
```

### 6. Benchmarking
- All 15 agents require comprehensive benchmarks (270 scenarios)
- Use `benchmark_runner.py` for validation
- Check OCR integration performance (target: 0.324s avg inference)

## Required Reading Before Changes
1. `PROJECT_STATUS.md`: Single source of truth for progress
2. `AGENT_PROJECT_MAPPING.md`: Agent task assignments
3. `TESTING_STANDARDS_UPDATE_SUMMARY.md`: Testing requirements
4. `ORCHESTRATION_DESIGN.md`: Triple-layer orchestration system
5. `RESEARCH_UPDATE_OCT_2025.md`: Latest research integration

## Current Development Focus
- Integration of WaltzRL safety modules
- Feature flags and CI/CD deployment
- Swarm optimization (Layer 5)

## Common Pitfalls
- Don't improvise agent assignments - strictly follow `AGENT_PROJECT_MAPPING.md`
- Ensure all code changes follow triple-layer orchestration patterns
- Always validate against all 270 benchmark scenarios
- Don't skip the mandatory audit workflow (Cora/Hudson + Alex)