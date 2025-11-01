# Agent Data Protocol (ADP) Format Specification - Genesis Implementation

**Version:** 1.0
**Date:** October 31, 2025
**Based On:** arXiv:2510.24702 - Agent Data Protocol
**Owner:** Cora (Agent design and orchestration)
**Status:** Week 1 Complete - Ready for Week 2 Implementation

---

## Executive Summary

This document defines the **Genesis-specific implementation** of the Agent Data Protocol (ADP), a standardized interlingua for agent training data. ADP enables cross-agent learning by unifying heterogeneous datasets (coding, tool use, browsing, support, legal) into a single format that all 15 Genesis agents can train on.

**Key Innovation:** Legal agents can learn from Support agent examples, QA agents can benefit from Builder code patterns, and all agents share a common knowledge base—without custom cross-pollination logic.

**Genesis Extensions:**
- Added `difficulty` field (easy/medium/hard) for balanced training
- Added `task_category` field aligned with agent specializations
- Added `agent_compatibility` scores for selective training
- Added `version` tracking for schema evolution

---

## 1. Core ADP Schema

### 1.1 Top-Level Structure

```json
{
  "id": "string (required)",
  "content": [
    {"type": "action | observation", "...": "..."}
  ],
  "details": {
    "...": "flexible metadata"
  },
  "genesis_extensions": {
    "...": "Genesis-specific fields"
  }
}
```

**Fields:**
- **id** (string, required): Unique identifier for this trajectory
- **content** (array, required): Alternating sequence of actions and observations
- **details** (object, required): Flexible metadata dictionary
- **genesis_extensions** (object, optional): Genesis-specific enhancements

### 1.2 Content Array Structure

**Alternation Rule:** Actions and observations MUST alternate.

**Valid Patterns:**
- ✅ `[observation, action, observation, action]`
- ✅ `[action, observation, action, observation]`
- ❌ `[action, action, observation]` (two actions in a row)
- ❌ `[observation, observation, action]` (two observations in a row)

**Why Alternation Matters:**
- Represents realistic agent-environment interaction loop
- Observation → Agent decides → Action → Environment responds → Observation
- Prevents malformed training data (e.g., responses without prompts)

---

## 2. Action Types

Actions represent **agent decisions** or **outputs**. ADP defines 3 canonical action types:

### 2.1 API Action (Function/Tool Calls)

**Use Cases:** Function calling, tool use, API invocations

**Schema:**
```json
{
  "type": "action",
  "action_type": "api",
  "data": {
    "function": "string (required)",
    "kwargs": "object (required)",
    "reasoning": "string (optional)"
  }
}
```

**Genesis Example (QA Agent calling pytest):**
```json
{
  "type": "action",
  "action_type": "api",
  "data": {
    "function": "run_pytest",
    "kwargs": {
      "test_file": "tests/test_api.py",
      "verbose": true,
      "capture": "no"
    },
    "reasoning": "Run integration tests to validate API endpoint behavior"
  }
}
```

**Genesis Example (Support Agent querying CRM):**
```json
{
  "type": "action",
  "action_type": "api",
  "data": {
    "function": "search_tickets",
    "kwargs": {
      "user_id": "12345",
      "status": "open",
      "category": "technical"
    },
    "reasoning": "Check for related open tickets before responding"
  }
}
```

**Validation Rules:**
- `function`: Non-empty string, valid function name (alphanumeric + underscore)
- `kwargs`: Valid JSON object (can be empty `{}`)
- `reasoning`: If present, ≥20 characters (meaningful explanation)

### 2.2 Code Action (Programming Tasks)

**Use Cases:** Code generation, editing, execution

**Schema:**
```json
{
  "type": "action",
  "action_type": "code",
  "data": {
    "language": "string (required)",
    "content": "string (required)",
    "reasoning": "string (optional)"
  }
}
```

**Genesis Example (Builder Agent generating FastAPI endpoint):**
```json
{
  "type": "action",
  "action_type": "code",
  "data": {
    "language": "python",
    "content": "@app.post(\"/api/users\")\nasync def create_user(user: UserCreate):\n    # Validate email format\n    if not is_valid_email(user.email):\n        raise HTTPException(400, \"Invalid email\")\n    # Create user in database\n    user_id = await db.users.insert_one(user.dict())\n    return {\"user_id\": str(user_id), \"status\": \"created\"}",
    "reasoning": "Implement user creation endpoint with email validation and error handling"
  }
}
```

**Genesis Example (QA Agent writing pytest test):**
```json
{
  "type": "action",
  "action_type": "code",
  "data": {
    "language": "python",
    "content": "def test_create_user_invalid_email():\n    response = client.post('/api/users', json={'email': 'invalid', 'password': 'Test123!'})\n    assert response.status_code == 400\n    assert 'Invalid email' in response.json()['detail']",
    "reasoning": "Test email validation edge case to ensure proper error handling"
  }
}
```

**Validation Rules:**
- `language`: One of: `python`, `javascript`, `typescript`, `bash`, `go`, `rust`, `java`, `sql`
- `content`: Non-empty string, ≥10 characters (meaningful code)
- `reasoning`: If present, ≥20 characters

### 2.3 Message Action (Natural Language)

**Use Cases:** Conversational agents, explanations, reports

**Schema:**
```json
{
  "type": "action",
  "action_type": "message",
  "data": {
    "content": "string (required)",
    "reasoning": "string (optional)",
    "role": "string (optional)"
  }
}
```

**Genesis Example (Support Agent troubleshooting):**
```json
{
  "type": "action",
  "action_type": "message",
  "data": {
    "content": "Based on the 401 error, the issue is likely an expired API key. Here's how to resolve it:\n\n1. Navigate to Settings → API Keys\n2. Click 'Regenerate Key'\n3. Copy the new key and update your .env file: `API_KEY=sk_new_key_here`\n4. Restart your application\n\nLet me know if you're still seeing errors after this.",
    "reasoning": "401 errors indicate authentication failure; expired keys are the most common cause",
    "role": "assistant"
  }
}
```

**Genesis Example (Analyst Agent presenting findings):**
```json
{
  "type": "action",
  "action_type": "message",
  "data": {
    "content": "## Churn Analysis Summary\n\n**Key Finding:** Churn rate increased 140% (5% → 12%) over 6 months.\n\n**Root Cause:** Support ticket volume doubled without headcount increase, leading to longer response times and customer frustration.\n\n**Recommendation:** Hire 2 additional support reps immediately ($120K/year) to reduce churn from 12% → 8%, retaining ~$60K MRR annually.",
    "reasoning": "Executive summary format with actionable recommendations and ROI calculation",
    "role": "assistant"
  }
}
```

**Validation Rules:**
- `content`: Non-empty string, ≥50 characters (substantive response)
- `reasoning`: If present, ≥20 characters
- `role`: If present, one of: `user`, `assistant`, `system`

---

## 3. Observation Types

Observations represent **environment feedback** or **user input**. ADP defines 2 canonical observation types:

### 3.1 Text Observation (Most Common)

**Use Cases:** Command-line output, API responses, user messages, test results, logs

**Schema:**
```json
{
  "type": "observation",
  "observation_type": "text",
  "data": {
    "content": "string (required)",
    "source": "string (required)"
  }
}
```

**Genesis Example (User input for Support Agent):**
```json
{
  "type": "observation",
  "observation_type": "text",
  "data": {
    "content": "I'm getting 401 Unauthorized errors when calling POST /api/users. I've copied my API key directly from the dashboard and I'm using Bearer token auth. It works in Postman but fails in my Node.js app. I'm on the Standard plan with 8,500 requests remaining this month.",
    "source": "user"
  }
}
```

**Genesis Example (Test output for QA Agent):**
```json
{
  "type": "observation",
  "observation_type": "text",
  "data": {
    "content": "============================= test session starts ==============================\ncollected 15 items\n\ntests/test_api.py::test_create_user PASSED\ntests/test_api.py::test_invalid_email FAILED\ntests/test_api.py::test_duplicate_email PASSED\n\n=========================== 1 failed, 14 passed in 2.43s ===========================\n\nFAILURE: test_invalid_email\nAssertionError: Expected 400, got 500",
    "source": "environment"
  }
}
```

**Validation Rules:**
- `content`: Non-empty string, ≥10 characters
- `source`: One of: `user` (human input), `environment` (system output)

### 3.2 Web Observation (Browser/GUI State)

**Use Cases:** Web browsing, GUI automation, E2E testing, visual analysis

**Schema:**
```json
{
  "type": "observation",
  "observation_type": "web",
  "data": {
    "html": "string (optional)",
    "accessibility_tree": "string (optional)",
    "url": "string (required)",
    "viewport_size": "object (optional)",
    "screenshot": "string (optional)"
  }
}
```

**Genesis Example (Vision Agent analyzing landing page):**
```json
{
  "type": "observation",
  "observation_type": "web",
  "data": {
    "html": "<html><head><title>Product Launch</title></head><body><h1>Introducing AI Assistant 2.0</h1><button id='cta'>Get Started Free</button></body></html>",
    "accessibility_tree": "[heading 'Introducing AI Assistant 2.0' level=1] [button 'Get Started Free' clickable]",
    "url": "https://example.com/product-launch",
    "viewport_size": {"width": 1920, "height": 1080},
    "screenshot": "base64_encoded_png_data_here"
  }
}
```

**Genesis Example (QA Agent E2E testing):**
```json
{
  "type": "observation",
  "observation_type": "web",
  "data": {
    "accessibility_tree": "[textbox 'Email' value=''] [textbox 'Password' value=''] [button 'Login' clickable] [link 'Forgot Password?']",
    "url": "https://app.example.com/login",
    "viewport_size": {"width": 1280, "height": 720}
  }
}
```

**Validation Rules:**
- `url`: Valid HTTP(S) URL
- `html`: If present, valid HTML (at least `<html>` tags)
- `accessibility_tree`: If present, non-empty string
- `viewport_size`: If present, object with `width` and `height` (positive integers)
- `screenshot`: If present, base64-encoded image data

---

## 4. Details Metadata

The `details` object contains **flexible metadata** that preserves dataset-specific information.

### 4.1 Standard Fields (ADP Core)

```json
{
  "details": {
    "dataset": "string (required)",
    "timestamp": "ISO 8601 datetime (optional)",
    "tags": ["array of strings (optional)"]
  }
}
```

**Example:**
```json
{
  "details": {
    "dataset": "deepresearch_generated",
    "timestamp": "2025-11-05T14:32:00Z",
    "tags": ["api_troubleshooting", "authentication", "nodejs"]
  }
}
```

### 4.2 Genesis Extensions

Genesis adds **standardized extensions** for training optimization:

```json
{
  "genesis_extensions": {
    "agent_name": "string (required)",
    "task_category": "string (required)",
    "difficulty": "easy | medium | hard (required)",
    "agent_compatibility": {
      "agent_name": "float (0-1 score)"
    },
    "version": "1.0 (schema version)",
    "quality_score": "float (0-10, optional)"
  }
}
```

**Field Definitions:**

**agent_name** (string, required):
- Original agent this example was created for
- One of 15 Genesis agents: `qa_agent`, `support_agent`, `legal_agent`, `analyst_agent`, `content_agent`, `builder_agent`, `deploy_agent`, `marketing_agent`, `sales_agent`, `finance_agent`, `research_agent`, `vision_agent`, `se_darwin_agent`, `memory_agent`, `security_agent`

**task_category** (string, required):
- Specific task type within agent's domain
- Examples: `test_generation`, `technical_troubleshooting`, `contract_review`, `data_analysis`, `blog_writing`
- Must be one of the agent's 5 task categories (see agent templates)

**difficulty** (enum, required):
- `easy`: Simple, straightforward tasks (30% of training data)
- `medium`: Realistic complexity, most common in production (45%)
- `hard`: Edge cases, expert-level, complex scenarios (25%)

**agent_compatibility** (object, optional):
- Scores (0-1) indicating how relevant this example is for each agent
- Used for selective training (Legal trains 80% on legal examples, 20% on support)
- Example:
  ```json
  {
    "support_agent": 1.0,
    "legal_agent": 0.7,
    "qa_agent": 0.3,
    "analyst_agent": 0.2
  }
  ```

**version** (string, required):
- ADP schema version for this example
- Current: `"1.0"`
- Enables future schema migrations

**quality_score** (float, optional):
- Hudson's 10-dimension quality score (0-10)
- Only present after manual review
- ≥9.0 indicates high-quality example

### 4.3 Complete Example (Genesis Extensions)

```json
{
  "id": "deepresearch_support_001",
  "content": [
    {
      "type": "observation",
      "observation_type": "text",
      "data": {
        "content": "User reports 401 errors when calling /api/users...",
        "source": "user"
      }
    },
    {
      "type": "action",
      "action_type": "message",
      "data": {
        "content": "Based on the error, the issue is likely...",
        "reasoning": "401 indicates auth failure, common causes are expired tokens..."
      }
    }
  ],
  "details": {
    "dataset": "deepresearch_generated",
    "timestamp": "2025-11-05T14:32:00Z",
    "tags": ["api_troubleshooting", "authentication"]
  },
  "genesis_extensions": {
    "agent_name": "support_agent",
    "task_category": "technical_troubleshooting",
    "difficulty": "medium",
    "agent_compatibility": {
      "support_agent": 1.0,
      "qa_agent": 0.6,
      "legal_agent": 0.2
    },
    "version": "1.0",
    "quality_score": 9.2
  }
}
```

---

## 5. Task Types Supported

Genesis ADP supports **all 15 agent specializations** across 5 broad categories:

### 5.1 Coding & Testing (QA, Builder, SE-Darwin)

**Agents:** qa_agent, builder_agent, se_darwin_agent

**Task Categories:**
- Test generation (unit, integration, E2E)
- Code review (security, performance, best practices)
- Code generation (API endpoints, utilities, infrastructure)
- Debugging (error analysis, root cause identification)
- Refactoring (optimization, maintainability improvements)

**Action Types:** Primarily `code` actions, some `api` for tool invocations

### 5.2 Support & Operations (Support, Deploy, Security)

**Agents:** support_agent, deploy_agent, security_agent

**Task Categories:**
- Technical troubleshooting (API errors, configuration issues)
- Deployment (CI/CD, infrastructure provisioning)
- Security (vulnerability assessment, incident response)
- Monitoring (alerting, performance analysis)
- Documentation (runbooks, postmortems)

**Action Types:** Mix of `message` (explanations), `api` (tool calls), `code` (scripts)

### 5.3 Legal & Compliance (Legal)

**Agents:** legal_agent

**Task Categories:**
- Contract review (NDAs, MSAs, SLAs)
- Regulatory compliance (GDPR, CCPA, HIPAA)
- Risk assessment (terms analysis, liability evaluation)
- Legal research (case law, statutes, precedents)
- Policy creation (privacy policies, terms of service)

**Action Types:** Primarily `message` actions (analysis, recommendations)

### 5.4 Business & Analytics (Analyst, Finance, Sales, Marketing)

**Agents:** analyst_agent, finance_agent, sales_agent, marketing_agent

**Task Categories:**
- Data analysis (metrics, trends, anomalies)
- Financial modeling (revenue projections, unit economics)
- Market research (competitive analysis, TAM/SAM/SOM)
- Sales strategy (lead qualification, outreach)
- Marketing content (campaigns, copy, SEO)

**Action Types:** Mix of `message` (reports, recommendations), `code` (analysis scripts)

### 5.5 Content & Research (Content, Research, Vision)

**Agents:** content_agent, research_agent, vision_agent

**Task Categories:**
- Content creation (blogs, emails, social media)
- Technical documentation (API docs, guides, README)
- Research synthesis (literature review, summaries)
- Visual analysis (UI review, accessibility audits)
- SEO optimization (keywords, meta descriptions)

**Action Types:** Primarily `message` actions, some `web` observations (Vision agent)

---

## 6. JSON Schema Definition

**Complete JSON Schema for Genesis ADP:**

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Genesis Agent Data Protocol",
  "type": "object",
  "required": ["id", "content", "details"],
  "properties": {
    "id": {
      "type": "string",
      "minLength": 1,
      "description": "Unique identifier for this trajectory"
    },
    "content": {
      "type": "array",
      "minItems": 1,
      "items": {
        "oneOf": [
          {"$ref": "#/definitions/action"},
          {"$ref": "#/definitions/observation"}
        ]
      },
      "description": "Alternating sequence of actions and observations"
    },
    "details": {
      "type": "object",
      "required": ["dataset"],
      "properties": {
        "dataset": {"type": "string"},
        "timestamp": {"type": "string", "format": "date-time"},
        "tags": {"type": "array", "items": {"type": "string"}}
      },
      "additionalProperties": true
    },
    "genesis_extensions": {
      "type": "object",
      "required": ["agent_name", "task_category", "difficulty", "version"],
      "properties": {
        "agent_name": {
          "type": "string",
          "enum": [
            "qa_agent", "support_agent", "legal_agent", "analyst_agent",
            "content_agent", "builder_agent", "deploy_agent", "marketing_agent",
            "sales_agent", "finance_agent", "research_agent", "vision_agent",
            "se_darwin_agent", "memory_agent", "security_agent"
          ]
        },
        "task_category": {"type": "string", "minLength": 1},
        "difficulty": {"type": "string", "enum": ["easy", "medium", "hard"]},
        "agent_compatibility": {
          "type": "object",
          "patternProperties": {
            "^(qa|support|legal|analyst|content|builder|deploy|marketing|sales|finance|research|vision|se_darwin|memory|security)_agent$": {
              "type": "number",
              "minimum": 0,
              "maximum": 1
            }
          }
        },
        "version": {"type": "string", "const": "1.0"},
        "quality_score": {"type": "number", "minimum": 0, "maximum": 10}
      }
    }
  },
  "definitions": {
    "action": {
      "type": "object",
      "required": ["type", "action_type", "data"],
      "properties": {
        "type": {"const": "action"},
        "action_type": {"enum": ["api", "code", "message"]},
        "data": {
          "oneOf": [
            {"$ref": "#/definitions/api_action_data"},
            {"$ref": "#/definitions/code_action_data"},
            {"$ref": "#/definitions/message_action_data"}
          ]
        }
      }
    },
    "observation": {
      "type": "object",
      "required": ["type", "observation_type", "data"],
      "properties": {
        "type": {"const": "observation"},
        "observation_type": {"enum": ["text", "web"]},
        "data": {
          "oneOf": [
            {"$ref": "#/definitions/text_observation_data"},
            {"$ref": "#/definitions/web_observation_data"}
          ]
        }
      }
    },
    "api_action_data": {
      "type": "object",
      "required": ["function", "kwargs"],
      "properties": {
        "function": {"type": "string", "minLength": 1},
        "kwargs": {"type": "object"},
        "reasoning": {"type": "string", "minLength": 20}
      }
    },
    "code_action_data": {
      "type": "object",
      "required": ["language", "content"],
      "properties": {
        "language": {
          "type": "string",
          "enum": ["python", "javascript", "typescript", "bash", "go", "rust", "java", "sql"]
        },
        "content": {"type": "string", "minLength": 10},
        "reasoning": {"type": "string", "minLength": 20}
      }
    },
    "message_action_data": {
      "type": "object",
      "required": ["content"],
      "properties": {
        "content": {"type": "string", "minLength": 50},
        "reasoning": {"type": "string", "minLength": 20},
        "role": {"type": "string", "enum": ["user", "assistant", "system"]}
      }
    },
    "text_observation_data": {
      "type": "object",
      "required": ["content", "source"],
      "properties": {
        "content": {"type": "string", "minLength": 10},
        "source": {"type": "string", "enum": ["user", "environment"]}
      }
    },
    "web_observation_data": {
      "type": "object",
      "required": ["url"],
      "properties": {
        "html": {"type": "string"},
        "accessibility_tree": {"type": "string"},
        "url": {"type": "string", "format": "uri"},
        "viewport_size": {
          "type": "object",
          "properties": {
            "width": {"type": "integer", "minimum": 1},
            "height": {"type": "integer", "minimum": 1}
          }
        },
        "screenshot": {"type": "string"}
      }
    }
  }
}
```

**Save this schema to:** `schemas/adp_format.json`

---

## 7. Validation Rules

### 7.1 Structural Validation

**Required:** All examples MUST pass these checks

1. **Top-level fields:**
   - `id` present and non-empty
   - `content` present and is array
   - `details` present and is object
   - `details.dataset` present

2. **Content array:**
   - At least 1 item
   - All items have `type` field ("action" or "observation")
   - Actions/observations alternate (no duplicates)

3. **Action validation:**
   - `action_type` is one of: api, code, message
   - `data` object has required fields for action type

4. **Observation validation:**
   - `observation_type` is one of: text, web
   - `data` object has required fields for observation type

### 7.2 Content Quality Validation

**Recommended:** Examples SHOULD pass these checks for high quality

1. **Length requirements:**
   - Message content: ≥50 characters
   - Code content: ≥10 characters
   - Text observation: ≥10 characters
   - Reasoning (if present): ≥20 characters

2. **Reasoning coverage:**
   - ≥70% of actions include reasoning field (target: 87.3% from paper)

3. **Genesis extensions:**
   - `agent_name` is valid Genesis agent
   - `task_category` matches agent's categories
   - `difficulty` matches complexity
   - `version` is "1.0"

### 7.3 Automated Validation Script

**Implementation:** `scripts/validate_adp_format.py`

```python
#!/usr/bin/env python3
"""
ADP Format Validator

Validates Genesis ADP examples against JSON schema and quality rules.

Usage:
    python scripts/validate_adp_format.py data/adp_examples/support_agent.jsonl
    python scripts/validate_adp_format.py --all
"""

import json
import jsonschema
from pathlib import Path

def validate_adp_example(example: dict, schema: dict) -> dict:
    """Validate single ADP example"""
    errors = []
    warnings = []

    # JSON schema validation
    try:
        jsonschema.validate(example, schema)
    except jsonschema.ValidationError as e:
        errors.append(f"Schema validation failed: {e.message}")

    # Alternation validation
    if not validate_alternation(example.get("content", [])):
        errors.append("Content array does not alternate between actions and observations")

    # Quality checks
    if not check_reasoning_coverage(example):
        warnings.append("Reasoning coverage below 70% target")

    return {
        "valid": len(errors) == 0,
        "errors": errors,
        "warnings": warnings
    }
```

---

## 8. Usage Examples

### 8.1 Creating ADP from DeepResearch Output

**Input (DeepResearch JSON):**
```json
{
  "task": "Generate pytest test for API endpoint",
  "context": "POST /api/users creates users with email validation",
  "expected_output": "def test_create_user()...",
  "difficulty": "medium",
  "agent_name": "qa_agent"
}
```

**Output (Genesis ADP):**
```json
{
  "id": "deepresearch_qa_001",
  "content": [
    {
      "type": "observation",
      "observation_type": "text",
      "data": {
        "content": "POST /api/users creates users with email validation. Requirements: validate email format, return 201 on success, 400 on invalid email.",
        "source": "user"
      }
    },
    {
      "type": "action",
      "action_type": "code",
      "data": {
        "language": "python",
        "content": "def test_create_user():\n    response = client.post('/api/users', json={'email': 'test@example.com', 'password': 'Test123!'})\n    assert response.status_code == 201\n\ndef test_invalid_email():\n    response = client.post('/api/users', json={'email': 'invalid', 'password': 'Test123!'})\n    assert response.status_code == 400",
        "reasoning": "Two test cases cover happy path and email validation edge case"
      }
    }
  ],
  "details": {
    "dataset": "deepresearch_generated",
    "timestamp": "2025-11-05T14:00:00Z",
    "tags": ["testing", "api", "validation"]
  },
  "genesis_extensions": {
    "agent_name": "qa_agent",
    "task_category": "test_generation",
    "difficulty": "medium",
    "agent_compatibility": {
      "qa_agent": 1.0,
      "builder_agent": 0.5,
      "support_agent": 0.3
    },
    "version": "1.0"
  }
}
```

### 8.2 Converting ADP to Unsloth Format

**Input (Genesis ADP):**
```json
{
  "id": "deepresearch_qa_001",
  "content": [
    {"type": "observation", "observation_type": "text", "data": {...}},
    {"type": "action", "action_type": "code", "data": {...}}
  ],
  "genesis_extensions": {
    "agent_name": "qa_agent",
    "task_category": "test_generation",
    "difficulty": "medium"
  }
}
```

**Output (Unsloth Training Format):**
```json
{
  "instruction": "Generate pytest test for API endpoint",
  "input": "POST /api/users creates users with email validation...",
  "output": "def test_create_user():...",
  "metadata": {
    "agent": "qa_agent",
    "category": "test_generation",
    "difficulty": "medium"
  }
}
```

---

## 9. Next Steps

### 9.1 Week 2 Implementation (Nov 4-8)

1. **Create Conversion Scripts:**
   - `scripts/convert_deepresearch_to_adp.py` (DeepResearch → ADP)
   - `scripts/convert_adp_to_unsloth.py` (ADP → Unsloth)
   - `scripts/validate_adp_format.py` (automated validation)

2. **Generate ADP Examples:**
   - Convert 6,665 DeepResearch examples (5 agents × 1,333 each)
   - Add Genesis extensions (agent_name, task_category, difficulty)
   - Calculate agent_compatibility scores

3. **Quality Validation:**
   - Run automated schema validation (100% pass target)
   - Hudson manual review (10% sample, ≥90% quality)
   - Fix failing examples

### 9.2 Week 3 Fine-Tuning (Nov 11-15)

1. **Convert to Training Format:**
   - ADP → Unsloth for all 15 agents
   - Selective training (agent_compatibility weighting)

2. **Fine-Tune Agents:**
   - Mixed training (DeepResearch + cross-agent examples)
   - Target: 30-40% improvement (vs 15-25% DeepResearch alone)

3. **Benchmark & Deploy:**
   - Before/after comparison
   - Validate cross-learning benefits
   - Deploy to staging

---

**Document Status:** ✅ Complete - Ready for Week 2 Implementation
**Next Document:** `ADP_CASEBANK_MAPPING.md` (Field-by-field conversion guide)
**Last Updated:** October 31, 2025
