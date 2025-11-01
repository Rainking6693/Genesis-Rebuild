# Bias Analysis Report

**Date:** 2025-10-31 20:56 UTC
**Dataset Size:** 99,990 examples

## Agent Specialization Analysis

| Agent | Status | Notes | Top Task Types |
|-------|--------|-------|----------------|
| analyst_agent | ✅ Balanced | 5 task types | edge_cases (4102), error_handling (4027), core_functionality (4010), integration (3942) |
| content_agent | ✅ Balanced | 5 task types | core_functionality (4061), error_handling (4050), performance (4028), integration (3962) |
| legal_agent | ✅ Balanced | 5 task types | core_functionality (4068), error_handling (4008), integration (4000), edge_cases (3982) |
| qa_agent | ✅ Balanced | 5 task types | edge_cases (4070), integration (4004), core_functionality (3999), performance (3994) |
| support_agent | ✅ Balanced | 5 task types | error_handling (4058), edge_cases (4016), core_functionality (4004), integration (3976) |

## Cross-Agent Source Diversity

| Agent | Status | Unique Sources | Top 3 Sources |
|-------|--------|----------------|---------------|
| analyst_agent | ✅ Good | 5 | legal_agent (5681), support_agent (4869), content_agent (4869) |
| content_agent | ✅ Good | 5 | analyst_agent (5894), legal_agent (4912), support_agent (4912) |
| legal_agent | ✅ Good | 5 | analyst_agent (6222), support_agent (5444), content_agent (4666) |
| qa_agent | ✅ Good | 5 | support_agent (7466), analyst_agent (4977), content_agent (3733) |
| support_agent | ✅ Good | 5 | legal_agent (5939), qa_agent (5091), analyst_agent (4242) |

## Hard Difficulty Coverage

| Agent | Status | Notes |
|-------|--------|-------|
| analyst_agent | ✅ Diverse | 5 categories |
| content_agent | ✅ Diverse | 5 categories |
| legal_agent | ✅ Diverse | 5 categories |
| qa_agent | ✅ Diverse | 5 categories |
| support_agent | ✅ Diverse | 5 categories |

## Difficulty vs. Token Length Correlation

| Agent | Status | Correlation |
|-------|--------|-------------|
| analyst_agent | ✅ Acceptable | 0.31 |
| content_agent | ✅ Acceptable | 0.32 |
| legal_agent | ✅ Acceptable | 0.35 |
| qa_agent | ✅ Acceptable | 0.33 |
| support_agent | ✅ Acceptable | 0.36 |

## Recommendations

1. Reduce dominant categories where status indicates bias above.
2. Expand cross-agent sampling for agents with <5 unique sources.
3. Add variety to hard-difficulty scenarios that only span a handful of categories.
4. Review prompt templates if token length tracks difficulty too closely.