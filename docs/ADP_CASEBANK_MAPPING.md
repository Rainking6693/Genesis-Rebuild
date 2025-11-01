# Agent Data Protocol - CaseBank Field Mapping

**Date:** October 31, 2025
**Owner:** Cora (Agent design and orchestration)
**Purpose:** Define field-by-field mapping from Genesis training data sources to ADP format

---

## Executive Summary

This document defines how Genesis converts various data sources (DeepResearch generated examples, existing CaseBank, future datasets) to the standardized ADP format. The primary source for Week 2 implementation is **DeepResearch-generated examples** (6,665 examples for 5 agents).

**Current CaseBank Note:** The existing `/home/genesis/genesis-rebuild/data/memory/casebank.jsonl` (839 entries) contains SE-Darwin evolution logs (state/action/reward for trajectory optimization). This will remain separate from ADP training data and continue to be used by SE-Darwin for evolution memory via LangGraph Store.

---

## 1. DeepResearch Output → ADP Mapping

**Source Format:** DeepResearch-generated examples from Week 2 generation sprint

**Input Schema:**
```json
{
  "task": "string",
  "context": "string",
  "expected_output": "string",
  "tools_used": ["search", "visit"],
  "difficulty": "easy | medium | hard",
  "agent_name": "string",
  "task_category": "string"
}
```

**Output Schema:** Genesis ADP (see `ADP_FORMAT_SPECIFICATION.md`)

### Field Mapping Table

| DeepResearch Field | ADP Location | Transformation | Notes |
|--------------------|--------------|----------------|-------|
| `task` | `content[0].data.content` (observation) | Copy directly | First observation in content array |
| `context` | Append to `content[0].data.content` | Concatenate: `task + "\n\n" + context` | Provides full user input |
| `expected_output` | `content[1].data.content` (action) | Copy directly | Agent's response |
| `tools_used` | `details.tags` | Add "used_{tool}" tags | E.g., ["used_search", "used_visit"] |
| `difficulty` | `genesis_extensions.difficulty` | Copy directly | easy/medium/hard |
| `agent_name` | `genesis_extensions.agent_name` | Copy directly | qa_agent, support_agent, etc. |
| `task_category` | `genesis_extensions.task_category` | Copy directly | test_generation, troubleshooting, etc. |
| (generated) | `id` | Generate: `{agent}_{category}_{index}` | E.g., "qa_test_generation_001" |
| (generated) | `details.dataset` | Set to "deepresearch_generated" | Identifies data source |
| (generated) | `details.timestamp` | Set to generation time | ISO 8601 format |
| (generated) | `content[0].type` | Set to "observation" | User input |
| (generated) | `content[0].observation_type` | Set to "text" | Most common type |
| (generated) | `content[0].data.source` | Set to "user" | Input source |
| (generated) | `content[1].type` | Set to "action" | Agent response |
| (generated) | `content[1].action_type` | Infer from content | "code" if contains `def`/`class`, else "message" |
| (generated) | `genesis_extensions.version` | Set to "1.0" | Schema version |
| (generated) | `genesis_extensions.agent_compatibility` | Calculate similarity scores | Cross-agent learning weights |

### Conversion Example

**Input (DeepResearch):**
```json
{
  "task": "Troubleshoot API 401 errors",
  "context": "User reports 401 Unauthorized when calling POST /api/users. Works in Postman but fails in Node.js app. Using Bearer token auth with correct API key from dashboard.",
  "expected_output": "The issue is likely caused by extra whitespace in your API key...",
  "tools_used": ["search", "visit"],
  "difficulty": "medium",
  "agent_name": "support_agent",
  "task_category": "technical_troubleshooting"
}
```

**Output (Genesis ADP):**
```json
{
  "id": "support_technical_troubleshooting_001",
  "content": [
    {
      "type": "observation",
      "observation_type": "text",
      "data": {
        "content": "Troubleshoot API 401 errors\n\nUser reports 401 Unauthorized when calling POST /api/users. Works in Postman but fails in Node.js app. Using Bearer token auth with correct API key from dashboard.",
        "source": "user"
      }
    },
    {
      "type": "action",
      "action_type": "message",
      "data": {
        "content": "The issue is likely caused by extra whitespace in your API key...",
        "reasoning": "401 errors indicate authentication failure. Common causes: expired token, whitespace in key, incorrect header format."
      }
    }
  ],
  "details": {
    "dataset": "deepresearch_generated",
    "timestamp": "2025-11-05T14:32:00Z",
    "tags": ["api_troubleshooting", "authentication", "used_search", "used_visit"]
  },
  "genesis_extensions": {
    "agent_name": "support_agent",
    "task_category": "technical_troubleshooting",
    "difficulty": "medium",
    "agent_compatibility": {
      "support_agent": 1.0,
      "qa_agent": 0.6,
      "legal_agent": 0.2,
      "builder_agent": 0.4
    },
    "version": "1.0"
  }
}
```

---

## 2. Agent Compatibility Score Calculation

**Purpose:** Enable selective cross-agent training (Legal trains 80% on legal examples, 20% on support)

**Algorithm:**
1. Primary agent gets score 1.0
2. Related agents get scores 0.4-0.8 based on task overlap
3. Unrelated agents get scores 0.0-0.3

**Task Category Similarity Matrix:**

| From → To | QA | Support | Legal | Analyst | Content | Builder |
|-----------|-----|---------|-------|---------|---------|---------|
| **test_generation** | 1.0 | 0.4 | 0.1 | 0.2 | 0.2 | 0.7 |
| **technical_troubleshooting** | 0.6 | 1.0 | 0.3 | 0.4 | 0.2 | 0.5 |
| **contract_review** | 0.2 | 0.4 | 1.0 | 0.6 | 0.4 | 0.1 |
| **data_analysis** | 0.3 | 0.3 | 0.5 | 1.0 | 0.4 | 0.2 |
| **blog_writing** | 0.2 | 0.2 | 0.3 | 0.3 | 1.0 | 0.1 |
| **code_generation** | 0.7 | 0.4 | 0.1 | 0.2 | 0.2 | 1.0 |

**Implementation:** `scripts/calculate_agent_compatibility.py`

---

## 3. Future Dataset Mappings

### 3.1 WebArena (Browser Automation)

**Use Case:** Train Vision agent on web interaction tasks

**Source Fields:**
- `task_id`, `intent`, `action_history`, `observation_history`, `url`, `screenshot`

**Mapping:**
- Actions → `code` actions (Playwright commands)
- Observations → `web` observations (HTML, accessibility tree, screenshot)
- Difficulty → Infer from action sequence length (≤3 steps = easy, 4-7 = medium, 8+ = hard)

### 3.2 SWE-bench (Code Editing)

**Use Case:** Train Builder and SE-Darwin agents on real GitHub issues

**Source Fields:**
- `instance_id`, `problem_statement`, `patch`, `test_patch`, `repo`, `base_commit`

**Mapping:**
- Problem → Observation (user input)
- Patch → Action (code changes)
- Agent: builder_agent or se_darwin_agent
- Difficulty: Infer from patch size (<20 lines = easy, 20-100 = medium, 100+ = hard)

### 3.3 API-Bank (Tool Use)

**Use Case:** Train all agents on function calling patterns

**Source Fields:**
- `api_id`, `api_description`, `arguments`, `response`, `usage_example`

**Mapping:**
- Usage example → Observation (task description)
- API call → Action (api action with function + kwargs)
- Agent: Infer from API domain (search → research_agent, payment → finance_agent)

---

## 4. Validation Checklist

**Pre-Conversion:**
- [ ] Source data loaded successfully (JSONL parsing)
- [ ] All required fields present in source
- [ ] Agent names valid (one of 15 Genesis agents)
- [ ] Task categories match agent specializations

**Post-Conversion:**
- [ ] All ADP examples pass JSON schema validation
- [ ] Content arrays alternate correctly (action ↔ observation)
- [ ] IDs are unique (no duplicates)
- [ ] Difficulty distribution matches target (30/45/25)
- [ ] Agent compatibility scores sum to ≥1.0 per example

**Quality Checks:**
- [ ] ≥70% of actions include reasoning field
- [ ] Average content length: observation ≥100 chars, action ≥200 chars
- [ ] No empty strings in critical fields
- [ ] Timestamps are valid ISO 8601

---

## 5. Implementation Scripts

### 5.1 Primary Converter

**File:** `scripts/convert_deepresearch_to_adp.py`

**Usage:**
```bash
python scripts/convert_deepresearch_to_adp.py \
  data/deepresearch_generated/qa_agent_examples.jsonl \
  data/adp_examples/qa_agent.jsonl \
  --validate
```

**Pseudocode:**
```python
def convert_deepresearch_to_adp(input_file, output_file):
    examples = load_jsonl(input_file)
    adp_examples = []

    for idx, ex in enumerate(examples):
        # Generate ID
        adp_id = f"{ex['agent_name']}_{ex['task_category']}_{idx:04d}"

        # Build content array
        observation = {
            "type": "observation",
            "observation_type": "text",
            "data": {
                "content": f"{ex['task']}\n\n{ex['context']}",
                "source": "user"
            }
        }

        # Infer action type
        action_type = "code" if is_code(ex['expected_output']) else "message"
        action = {
            "type": "action",
            "action_type": action_type,
            "data": {
                "content": ex['expected_output'],
                "reasoning": infer_reasoning(ex)  # TODO: Add reasoning
            }
        }

        # Calculate compatibility scores
        compatibility = calculate_agent_compatibility(
            ex['agent_name'],
            ex['task_category']
        )

        # Build ADP object
        adp_example = {
            "id": adp_id,
            "content": [observation, action],
            "details": {
                "dataset": "deepresearch_generated",
                "timestamp": datetime.utcnow().isoformat() + "Z",
                "tags": build_tags(ex)
            },
            "genesis_extensions": {
                "agent_name": ex['agent_name'],
                "task_category": ex['task_category'],
                "difficulty": ex['difficulty'],
                "agent_compatibility": compatibility,
                "version": "1.0"
            }
        }

        # Validate
        if validate_adp(adp_example):
            adp_examples.append(adp_example)

    # Save to JSONL
    save_jsonl(adp_examples, output_file)
    print(f"Converted {len(adp_examples)}/{len(examples)} examples")
```

### 5.2 Compatibility Calculator

**File:** `scripts/calculate_agent_compatibility.py`

```python
# Similarity matrix (15x15 for all agents)
TASK_SIMILARITY = {
    ("test_generation", "qa_agent"): 1.0,
    ("test_generation", "builder_agent"): 0.7,
    ("test_generation", "support_agent"): 0.4,
    # ... 170+ more mappings
}

def calculate_agent_compatibility(agent_name, task_category):
    """Calculate how relevant this example is for each agent"""
    scores = {}

    for target_agent in ALL_AGENTS:
        key = (task_category, target_agent)
        scores[target_agent] = TASK_SIMILARITY.get(key, 0.1)  # Default: 0.1

    return scores
```

---

## 6. Week 2 Execution Plan

**Timeline:** Nov 4-8, 2025 (5 days)

**Day 1-2: Script Development**
- Implement `convert_deepresearch_to_adp.py` (200-300 lines)
- Implement `calculate_agent_compatibility.py` (populate 15×15 matrix)
- Unit tests for conversion logic

**Day 3: Batch Conversion**
- Convert 6,665 DeepResearch examples (5 agents × 1,333)
- Generate ADP JSONL files per agent
- Run automated validation

**Day 4: Quality Review**
- Hudson manual review (10% sample = 667 examples)
- Fix failing examples (regenerate with reasoning)
- Achieve ≥90% quality score

**Day 5: Unsloth Preparation**
- Implement `convert_adp_to_unsloth.py`
- Generate training files for all agents
- Ready for Week 3 fine-tuning

---

**Document Status:** ✅ Complete - Ready for Week 2 Implementation
**Next Document:** `ADP_CROSS_AGENT_LEARNING_MATRIX.md`
**Last Updated:** October 31, 2025
