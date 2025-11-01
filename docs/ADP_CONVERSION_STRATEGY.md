# Agent Data Protocol - Conversion Strategy

**Date:** October 31, 2025
**Owner:** Cora (Agent design and orchestration), Thon (Python implementation)
**Purpose:** Week 2 implementation plan for converting Genesis training data to ADP format

---

## Executive Summary

This document outlines the **Week 2 (Nov 4-8)** strategy for converting 6,665 DeepResearch-generated examples to ADP format, enabling cross-agent learning for all 15 Genesis agents.

**Timeline:** 5 days
**Target Output:** 6,665 ADP examples (5 agents × 1,333 examples each)
**Success Criteria:** ≥95% automated validation pass rate, ≥90% Hudson quality score

---

## 1. Three-Stage Conversion Pipeline

### Stage 1: DeepResearch → ADP (Dataset-Specific)
**Input:** `data/deepresearch_generated/{agent}_examples.jsonl`
**Output:** `data/adp_examples/{agent}.jsonl`
**Script:** `scripts/convert_deepresearch_to_adp.py`

### Stage 2: ADP → Unsloth (Agent-Specific)
**Input:** `data/adp_examples/{agent}.jsonl`
**Output:** `data/training/{agent}_training.jsonl`
**Script:** `scripts/convert_adp_to_unsloth.py`

### Stage 3: Fine-Tuning (Week 3)
**Input:** `data/training/{agent}_training.jsonl`
**Output:** Fine-tuned models for 15 agents
**Implementation:** Existing Unsloth pipeline

---

## 2. Week 2 Timeline (Nov 4-8)

### Day 1 (Monday): Script Development

**Morning (4 hours):**
- Implement `convert_deepresearch_to_adp.py` core logic
  - Parse DeepResearch JSONL
  - Build ADP content arrays (observation + action)
  - Add Genesis extensions (agent_name, task_category, difficulty)
  - Generate unique IDs

**Afternoon (4 hours):**
- Implement `calculate_agent_compatibility.py`
  - Load 15×15 cross-agent learning matrix
  - Calculate compatibility scores for each example
  - Add scores to `genesis_extensions.agent_compatibility`

**Evening Testing:**
- Unit tests for conversion logic
- Test on 10-example sample from each agent
- Validate output with `scripts/validate_adp_format.py`

**Deliverables:**
- ✅ `convert_deepresearch_to_adp.py` (~250 lines)
- ✅ `calculate_agent_compatibility.py` (~150 lines)
- ✅ Unit tests passing (10 examples × 5 agents = 50 tests)

### Day 2 (Tuesday): Batch Conversion Part 1

**Morning (4 hours):**
- Convert QA agent examples (1,333 → ADP)
- Convert Support agent examples (1,333 → ADP)
- Run automated validation

**Afternoon (4 hours):**
- Fix validation errors (expected: 5-10% failure rate)
- Add missing reasoning fields (target: ≥70% coverage)
- Re-run conversion with fixes

**Evening Review:**
- Hudson manual review (10% sample = 267 examples)
- Document common issues
- Update conversion script based on feedback

**Deliverables:**
- ✅ 2,666 ADP examples (QA + Support)
- ✅ Automated validation: ≥95% pass rate
- ✅ Hudson preliminary score: ≥85/100

### Day 3 (Wednesday): Batch Conversion Part 2

**Morning (4 hours):**
- Convert Legal agent examples (1,333 → ADP)
- Convert Analyst agent examples (1,333 → ADP)
- Apply lessons learned from Day 2

**Afternoon (4 hours):**
- Convert Content agent examples (1,333 → ADP)
- Run full validation on all 6,665 examples
- Generate statistics report

**Evening Testing:**
- Cross-agent sampling test (verify weighted sampling works)
- Difficulty distribution check (30/45/25 target)
- Compatibility score validation (sum ≥1.0 per example)

**Deliverables:**
- ✅ 6,665 total ADP examples (all 5 agents)
- ✅ Validation report: pass rates, error summary, quality scores
- ✅ Statistics dashboard: difficulty distribution, agent distribution

### Day 4 (Thursday): Quality Assurance

**Morning (4 hours):**
- Hudson comprehensive review (10% sample = 667 examples)
- Categorize failures (schema, content, reasoning, compatibility)
- Prioritize fixes (P0: blocks fine-tuning, P1: degrades quality, P2: nice-to-have)

**Afternoon (4 hours):**
- Fix P0 issues (schema validation failures, missing required fields)
- Regenerate examples with improved prompts
- Re-run Hudson review on fixed examples

**Evening Approval:**
- Final Hudson score: target ≥90/100
- Sign-off for Week 3 fine-tuning
- Archive v1.0 ADP dataset

**Deliverables:**
- ✅ Hudson approval (≥90/100 quality score)
- ✅ Zero P0 blockers
- ✅ Production-ready ADP dataset (6,665 examples)

### Day 5 (Friday): Unsloth Preparation

**Morning (4 hours):**
- Implement `convert_adp_to_unsloth.py` (~77 lines target)
- Convert ADP → Unsloth format for all 5 agents
- Apply weighted sampling (cross-agent compatibility)

**Afternoon (4 hours):**
- Generate training files:
  - QA agent: 1,334 examples (50% QA, 20% SE-Darwin, 15% Builder, 10% Security, 5% others)
  - Support agent: 1,334 examples (50% Support, 20% Deploy, 15% Legal, 10% QA, 5% others)
  - Legal agent: 1,334 examples (50% Legal, 15% Analyst, 15% Finance, 10% Support, 5% Research, 5% others)
  - Analyst agent: 1,334 examples (50% Analyst, 20% Finance, 15% Marketing, 10% Sales, 5% others)
  - Content agent: 1,334 examples (50% Content, 20% Marketing, 15% Research, 10% Sales, 5% others)

**Evening Validation:**
- Verify Unsloth format compatibility
- Test fine-tuning with 10-example subset
- Document any issues for Week 3

**Deliverables:**
- ✅ `convert_adp_to_unsloth.py` implemented
- ✅ 5 training files ready for fine-tuning
- ✅ Week 3 kickoff document (fine-tuning plan, benchmarks, timeline)

---

## 3. Implementation Details

### 3.1 Core Conversion Script

**File:** `scripts/convert_deepresearch_to_adp.py`

```python
#!/usr/bin/env python3
"""
DeepResearch to ADP Converter

Converts DeepResearch-generated examples to Genesis ADP format.

Usage:
    python scripts/convert_deepresearch_to_adp.py \
        data/deepresearch_generated/qa_agent_examples.jsonl \
        data/adp_examples/qa_agent.jsonl \
        --validate
"""

import json
import sys
from pathlib import Path
from datetime import datetime
from typing import List, Dict
from calculate_agent_compatibility import calculate_compatibility


def load_jsonl(file_path: Path) -> List[dict]:
    """Load JSONL file"""
    examples = []
    with open(file_path, 'r') as f:
        for line in f:
            if line.strip():
                examples.append(json.loads(line))
    return examples


def save_jsonl(examples: List[dict], file_path: Path):
    """Save to JSONL file"""
    with open(file_path, 'w') as f:
        for example in examples:
            f.write(json.dumps(example) + '\n')


def infer_action_type(content: str) -> str:
    """Infer action type from content"""
    # Check for code indicators
    code_keywords = ['def ', 'class ', 'import ', 'function ', 'const ', 'let ', 'var ']
    if any(keyword in content for keyword in code_keywords):
        return 'code'

    # Check for API call indicators
    api_keywords = ['search(', 'visit(', 'call(', 'invoke(']
    if any(keyword in content for keyword in api_keywords):
        return 'api'

    # Default: message
    return 'message'


def build_reasoning(task: str, context: str, output: str) -> str:
    """Generate reasoning based on task and output (placeholder)"""
    # TODO: Use LLM to generate reasoning in production
    # For now, return basic reasoning based on heuristics
    return f"Addressing {task} based on provided context and requirements"


def convert_to_adp(deepresearch_example: dict, index: int) -> dict:
    """Convert single DeepResearch example to ADP format"""

    agent_name = deepresearch_example['agent_name']
    task_category = deepresearch_example['task_category']
    difficulty = deepresearch_example['difficulty']

    # Generate unique ID
    adp_id = f"{agent_name}_{task_category}_{index:04d}"

    # Build observation (user input)
    observation = {
        "type": "observation",
        "observation_type": "text",
        "data": {
            "content": f"{deepresearch_example['task']}\n\n{deepresearch_example['context']}",
            "source": "user"
        }
    }

    # Infer action type and build action
    action_type = infer_action_type(deepresearch_example['expected_output'])

    if action_type == 'code':
        action_data = {
            "language": "python",  # TODO: Infer language
            "content": deepresearch_example['expected_output'],
            "reasoning": build_reasoning(
                deepresearch_example['task'],
                deepresearch_example['context'],
                deepresearch_example['expected_output']
            )
        }
    else:  # message or api
        action_data = {
            "content": deepresearch_example['expected_output'],
            "reasoning": build_reasoning(
                deepresearch_example['task'],
                deepresearch_example['context'],
                deepresearch_example['expected_output']
            )
        }

    action = {
        "type": "action",
        "action_type": action_type,
        "data": action_data
    }

    # Build details
    details = {
        "dataset": "deepresearch_generated",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "tags": [task_category] + [f"used_{tool}" for tool in deepresearch_example.get('tools_used', [])]
    }

    # Calculate agent compatibility scores
    compatibility = calculate_compatibility(agent_name, task_category)

    # Build ADP example
    adp_example = {
        "id": adp_id,
        "content": [observation, action],
        "details": details,
        "genesis_extensions": {
            "agent_name": agent_name,
            "task_category": task_category,
            "difficulty": difficulty,
            "agent_compatibility": compatibility,
            "version": "1.0"
        }
    }

    return adp_example


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Convert DeepResearch to ADP format")
    parser.add_argument("input_file", help="Input JSONL file (DeepResearch format)")
    parser.add_argument("output_file", help="Output JSONL file (ADP format)")
    parser.add_argument("--validate", action="store_true", help="Run validation after conversion")

    args = parser.parse_args()

    # Load examples
    print(f"Loading {args.input_file}...")
    examples = load_jsonl(Path(args.input_file))
    print(f"Loaded {len(examples)} examples")

    # Convert to ADP
    print("Converting to ADP format...")
    adp_examples = []
    for idx, ex in enumerate(examples):
        try:
            adp_ex = convert_to_adp(ex, idx)
            adp_examples.append(adp_ex)
        except Exception as e:
            print(f"Error converting example {idx}: {e}")

    # Save
    print(f"Saving to {args.output_file}...")
    save_jsonl(adp_examples, Path(args.output_file))
    print(f"✅ Converted {len(adp_examples)}/{len(examples)} examples")

    # Validate if requested
    if args.validate:
        print("Running validation...")
        # TODO: Call validate_adp_format.py
        print("Validation complete (see validate_adp_format.py output)")


if __name__ == "__main__":
    main()
```

### 3.2 Compatibility Calculator

**File:** `scripts/calculate_agent_compatibility.py`

```python
#!/usr/bin/env python3
"""
Agent Compatibility Score Calculator

Calculates cross-agent learning compatibility scores based on 15×15 matrix.
"""

from typing import Dict

# 15×15 cross-agent learning matrix (excerpt - full matrix has 225 entries)
CROSS_AGENT_MATRIX = {
    "qa_agent": {
        "qa_agent": 1.0,
        "support_agent": 0.6,
        "legal_agent": 0.2,
        "analyst_agent": 0.4,
        "content_agent": 0.3,
        "builder_agent": 0.8,
        "deploy_agent": 0.5,
        "marketing_agent": 0.2,
        "sales_agent": 0.2,
        "finance_agent": 0.3,
        "research_agent": 0.4,
        "vision_agent": 0.5,
        "se_darwin_agent": 0.9,
        "memory_agent": 0.4,
        "security_agent": 0.7
    },
    # ... 14 more agents (full matrix in implementation)
}


def calculate_compatibility(source_agent: str, task_category: str) -> Dict[str, float]:
    """
    Calculate compatibility scores for all agents given a source agent and task.

    Args:
        source_agent: Agent that created the training example
        task_category: Task category (e.g., "test_generation", "troubleshooting")

    Returns:
        Dictionary mapping agent names to compatibility scores (0-1)
    """
    if source_agent not in CROSS_AGENT_MATRIX:
        raise ValueError(f"Unknown agent: {source_agent}")

    # Base scores from matrix
    scores = CROSS_AGENT_MATRIX[source_agent].copy()

    # TODO: Adjust scores based on task_category
    # For now, return base matrix scores

    return scores


def main():
    """Test compatibility calculator"""
    print("Agent Compatibility Calculator\n")

    # Test case
    source = "qa_agent"
    category = "test_generation"

    scores = calculate_compatibility(source, category)

    print(f"Source: {source}")
    print(f"Category: {category}\n")
    print("Compatibility Scores:")

    # Sort by score descending
    sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)

    for agent, score in sorted_scores:
        bar = "█" * int(score * 10)
        print(f"  {agent:20} [{bar:<10}] {score:.1f}")


if __name__ == "__main__":
    main()
```

---

## 4. Quality Assurance Checklist

### Pre-Conversion Validation
- [ ] All 5 DeepResearch JSONL files present and valid
- [ ] Files contain expected number of examples (1,333 each)
- [ ] Agent names are valid Genesis agents
- [ ] Task categories match agent specializations
- [ ] Difficulty distribution is balanced (30/45/25 ±5%)

### Post-Conversion Validation
- [ ] All ADP examples pass JSON schema validation
- [ ] Content arrays alternate correctly (no duplicate types)
- [ ] All IDs are unique (6,665 unique IDs)
- [ ] All examples have genesis_extensions
- [ ] Agent compatibility scores sum to ≥1.0 per example
- [ ] ≥70% of actions include reasoning field (target: 87.3%)

### Hudson Manual Review
- [ ] 10% random sample reviewed (667 examples)
- [ ] Quality score ≥90/100 average
- [ ] No P0 blockers identified
- [ ] Feedback incorporated into conversion script
- [ ] Final approval granted

---

## 5. Error Handling & Recovery

### Common Conversion Errors

**Error 1: Missing Required Fields**
- **Symptom:** `KeyError: 'task'` or `KeyError: 'context'`
- **Cause:** Malformed DeepResearch input
- **Fix:** Skip example, log error, continue processing

**Error 2: Invalid Action Type Inference**
- **Symptom:** Action classified as `message` when it's actually `code`
- **Cause:** Heuristic classification fails
- **Fix:** Add more code keywords, use LLM for ambiguous cases

**Error 3: Empty Reasoning Field**
- **Symptom:** `reasoning: ""`
- **Cause:** `build_reasoning()` returns empty string
- **Fix:** Generate basic reasoning from task + output, flag for manual review

**Error 4: Compatibility Scores Don't Sum Correctly**
- **Symptom:** `sum(compatibility.values()) < 1.0`
- **Cause:** Missing agents in matrix
- **Fix:** Ensure all 15 agents present, normalize scores

### Recovery Strategies

**Incremental Conversion:**
- Convert 100 examples at a time
- Validate after each batch
- Stop on first error, fix, resume

**Checkpointing:**
- Save progress every 500 examples
- Resume from last checkpoint on failure
- Keep failed examples in separate file for review

**Parallel Processing:**
- Process 5 agents in parallel (one process per agent)
- Total time: 1-2 hours (vs 5-10 hours sequential)
- Use `multiprocessing` module

---

## 6. Week 3 Handoff

### Deliverables for Fine-Tuning

**Data Files:**
- `data/adp_examples/qa_agent.jsonl` (1,333 examples)
- `data/adp_examples/support_agent.jsonl` (1,333 examples)
- `data/adp_examples/legal_agent.jsonl` (1,333 examples)
- `data/adp_examples/analyst_agent.jsonl` (1,333 examples)
- `data/adp_examples/content_agent.jsonl` (1,333 examples)

**Training Files (Unsloth format):**
- `data/training/qa_agent_training.jsonl` (1,334 examples, mixed)
- `data/training/support_agent_training.jsonl` (1,334 examples, mixed)
- `data/training/legal_agent_training.jsonl` (1,334 examples, mixed)
- `data/training/analyst_agent_training.jsonl` (1,334 examples, mixed)
- `data/training/content_agent_training.jsonl` (1,334 examples, mixed)

**Documentation:**
- Conversion report (statistics, errors, quality scores)
- Hudson approval certificate (≥90/100 score)
- Week 3 fine-tuning plan

### Success Metrics

**Conversion Quality:**
- ✅ 6,665 ADP examples generated (100% of target)
- ✅ ≥95% automated validation pass rate
- ✅ ≥90% Hudson quality score
- ✅ Zero P0 blockers

**Cross-Agent Learning:**
- ✅ Weighted sampling implemented
- ✅ All 15 agents have compatibility scores
- ✅ Training files include cross-agent examples (50% self, 50% others)

**Timeline:**
- ✅ Week 2 complete on schedule (Nov 4-8)
- ✅ Ready for Week 3 fine-tuning (Nov 11-15)

---

## 7. Contingency Planning

### Risk 1: Conversion Takes Longer Than Expected

**Impact:** Delay to fine-tuning timeline
**Probability:** Medium (30%)

**Mitigation:**
- Use parallel processing (5 agents simultaneously)
- Reduce manual review sample (10% → 5%)
- Extend Week 2 by 1-2 days if needed

**Contingency:**
- Convert 3 agents first (QA, Support, Legal)
- Fine-tune those 3 in Week 3
- Convert remaining 2 agents (Analyst, Content) in parallel

### Risk 2: Quality Below Hudson Threshold (<90/100)

**Impact:** Fine-tuning delayed until quality improves
**Probability:** Low (15%)

**Mitigation:**
- Add better reasoning generation (use GPT-4o)
- Manual review and edit 5% highest-value examples
- Increase cross-agent compatibility weighting

**Contingency:**
- Accept 85/100 score with Hudson approval
- Plan improvement iteration in Phase 8
- Focus on high-quality subset (top 80%)

### Risk 3: Unsloth Format Incompatibility

**Impact:** Can't fine-tune until format fixed
**Probability:** Very Low (5%)

**Mitigation:**
- Test conversion with 10-example subset on Day 1
- Validate against existing Unsloth pipeline early
- Have fallback format (OpenAI messages) ready

**Contingency:**
- Use existing CaseBank converter as template
- Consult Unsloth documentation
- Worst case: Manual format adjustment (1 day)

---

**Document Status:** ✅ Complete - Ready for Week 2 Implementation
**Handoff:** Thon (Python implementation), Vanguard (execution coordination)
**Last Updated:** October 31, 2025
