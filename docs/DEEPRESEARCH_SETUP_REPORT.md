# DeepResearch Data Pipeline - Setup & Implementation Guide

**Date:** October 31, 2025
**Version:** 1.0
**Status:** Week 1 Complete - Ready for 20K Generation
**Owner:** Vanguard (MLOps orchestration)

---

## Executive Summary

The DeepResearch Data Pipeline implementation enables **automated generation of 20,000+ synthetic training examples** for all 15 Genesis agents using Alibaba's Tongyi-DeepResearch-30B-A3B model.

### Key Features

- ✅ **30.5B Parameter MoE Model:** Only 3.3B activated per token
- ✅ **128K Context Length:** Handle long-form research tasks
- ✅ **Dual Inference Modes:** ReAct (standard) + IterResearch (test-time scaling)
- ✅ **Fully Automated Pipeline:** End-to-end synthetic data generation
- ✅ **15 Agent Coverage:** Custom templates for all Genesis agents

### Quick Start

```bash
# Navigate to DeepResearch directory
cd /home/genesis/genesis-rebuild/external/DeepResearch

# Activate environment
conda activate react_infer_env

# Set API keys
export OPENAI_API_KEY=your_key_here
export GOOGLE_API_KEY=your_key_here
export JINA_API_KEY=your_key_here

# Run inference
bash run_react_infer.sh
```

---

## Architecture

### Component Overview

```
┌─────────────────────────────────────────────────────────────┐
│           Genesis Agent Templates (15 agents)                │
│  qa_agent, support_agent, legal_agent, analyst_agent...     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│         Tongyi-DeepResearch-30B-A3B Model                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  ReAct Mode (Standard)                               │   │
│  │  - Reasoning + Acting paradigm                       │   │
│  │  - Step-by-step task decomposition                   │   │
│  │  - Tool use (Search, Scholar, Visit)                 │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  IterResearch Mode (Test-Time Scaling)              │   │
│  │  - Iterative research refinement                     │   │
│  │  - Multiple rollouts (n=3)                           │   │
│  │  - Fusion agent for synthesis                        │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│         Synthetic Training Data (20,000+ examples)           │
│  ┌──────────────┬──────────────┬───────────┬──────────────┐ │
│  │ qa_agent     │ support_agent│legal_agent│ analyst_agent│ │
│  │ 1,333 examples│ 1,333 examples│1,333 examples│1,333 examples│ │
│  └──────────────┴──────────────┴───────────┴──────────────┘ │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Unsloth Fine-Tuning Pipeline                    │
│  (Existing Genesis infrastructure - Phase 6 complete)        │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Model Specifications

**Model:** Tongyi-DeepResearch-30B-A3B
- **Architecture:** Mixture of Experts (MoE)
- **Total Parameters:** 30.5 billion
- **Active Parameters:** 3.3 billion per token (efficient inference)
- **Context Length:** 128K tokens
- **Training:** Continual pre-training + RL (Group Relative Policy Optimization)

**Download Links:**
- HuggingFace: `Alibaba-NLP/Tongyi-DeepResearch-30B-A3B`
- ModelScope: `iic/Tongyi-DeepResearch-30B-A3B`

**Performance Benchmarks:**
- Humanity's Last Exam (HLE): State-of-the-art
- BrowseComp, BrowseComp-ZH: Leading performance
- WebWalkerQA, xbench-DeepSearch: Top scores
- FRAMES, SimpleQA: Competitive results

### Inference Modes

#### 1. ReAct Mode (Standard)

**Description:** Reasoning + Acting paradigm for step-by-step task solving

**Architecture:**
```
User Query → Reasoning Step → Action (Tool Use) → Observation →
Reasoning Step → Action → ... → Final Answer
```

**Tools Available:**
- **Search:** Google Search API for web queries
- **Scholar:** Academic paper search
- **Visit:** Web page content extraction (Jina API)

**Use Cases:**
- Standard agent task generation
- Straightforward problem-solving
- Rigorously evaluate intrinsic model abilities

**Example ReAct Trace:**
```
Thought: I need to search for information about pytest best practices.
Action: Search["pytest best practices 2025"]
Observation: Found 10 results including official documentation...
Thought: Let me visit the official pytest docs for authoritative information.
Action: Visit["https://docs.pytest.org/en/stable/goodpractices.html"]
Observation: The page contains comprehensive best practices...
Thought: I now have enough information to generate the training example.
Answer: [Generated training example for qa_agent]
```

#### 2. IterResearch Mode (Test-Time Scaling)

**Description:** Iterative research with multiple rollouts and fusion for maximum performance

**Architecture:**
```
User Query →
  ├─ Rollout 1 (ReAct) → Result 1
  ├─ Rollout 2 (ReAct) → Result 2
  └─ Rollout 3 (ReAct) → Result 3
       ↓
  Fusion Agent (synthesizes best result)
       ↓
  Final Answer
```

**Parameters:**
- `--num_rollouts 3`: Generate 3 independent solutions
- `--fusion_last_k 2`: Use last 2 steps from each rollout for fusion

**Use Cases:**
- Complex multi-step agent tasks
- High-quality training data generation
- Unlock maximum model performance ceiling

**Cost vs Quality Trade-off:**
- ReAct Mode: 1x cost, standard quality
- IterResearch Mode: 3x cost, maximum quality (worth it for training data)

---

## Environment Setup

### Prerequisites

**Python Version:** 3.10.0 (recommended)
- Other versions (3.11-3.12) may work but could cause dependency issues
- Use isolated environment (conda or virtualenv)

### Installation Steps

#### 1. Verify DeepResearch Clone

```bash
# Check if already cloned
ls -la /home/genesis/genesis-rebuild/external/DeepResearch

# Expected output:
# README.md, requirements.txt, Tech_Report.pdf, Agent/, WebAgent/, inference/, evaluation/
```

✅ **Status:** Already cloned at `/home/genesis/genesis-rebuild/external/DeepResearch`

#### 2. Create Conda Environment

```bash
# Create environment with Python 3.10.0
conda create -n react_infer_env python=3.10.0

# Activate environment
conda activate react_infer_env
```

#### 3. Install Dependencies

```bash
cd /home/genesis/genesis-rebuild/external/DeepResearch

# Install required packages
pip install -r requirements.txt
```

**Key Dependencies:**
- `transformers`: Hugging Face model loading
- `torch`: PyTorch for model inference
- `requests`: HTTP requests for tool APIs
- `pydantic`: Data validation
- `python-dotenv`: Environment variable management

#### 4. Configure API Keys

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your API keys
nano .env
```

**Required API Keys:**

1. **Google Search API** (for Search tool)
   - Get at: https://console.cloud.google.com/apis/credentials
   - Cost: Free tier available, $5/1000 queries

2. **Jina AI API** (for Visit tool)
   - Get at: https://jina.ai/
   - Cost: Free tier available

3. **OpenAI API** (optional, for evaluation)
   - Get at: https://platform.openai.com/api-keys
   - Cost: Pay-as-you-go, ~$0.002/1K tokens (GPT-3.5)

**.env Configuration:**
```bash
# Google Search (required)
GOOGLE_API_KEY=your_google_api_key_here

# Jina AI (required)
JINA_API_KEY=your_jina_api_key_here

# OpenAI (optional - for evaluation only)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1

# Model Path (update if using local model)
MODEL_PATH=/path/to/Tongyi-DeepResearch-30B-A3B
```

#### 5. Download Model (Optional)

**Option A: Use Online API** (Recommended for testing)
```bash
# Model will be accessed via ModelScope/HuggingFace API
# No local download needed
```

**Option B: Local Inference** (Recommended for 20K generation)
```bash
# Download from HuggingFace
huggingface-cli download Alibaba-NLP/Tongyi-DeepResearch-30B-A3B

# Or use git lfs
git lfs install
git clone https://huggingface.co/Alibaba-NLP/Tongyi-DeepResearch-30B-A3B

# Update MODEL_PATH in .env
```

**Storage Requirements:**
- Model size: ~60GB (quantized versions available)
- Recommended: 100GB free space for model + cache

---

## Prompt Template Design

### Template Structure

Each agent template defines:
1. **Agent Role:** Clear description of agent's purpose
2. **Task Examples:** 10-15 diverse task scenarios
3. **Quality Criteria:** What makes a good example
4. **Output Format:** JSON structure for training data

### Template Components

```python
{
    "agent_name": "qa_agent",
    "agent_role": "Quality assurance and automated testing specialist",
    "task_categories": [
        "test_generation",
        "bug_detection",
        "code_review",
        "integration_testing",
        "performance_testing"
    ],
    "example_tasks": [
        "Generate pytest test cases for a Python REST API",
        "Identify edge cases for a sorting algorithm",
        "Review code for common security vulnerabilities",
        ...
    ],
    "quality_criteria": {
        "specificity": "Task should be specific and actionable",
        "complexity": "Appropriate difficulty level (not too easy, not impossible)",
        "realism": "Reflects real-world agent use cases",
        "diversity": "Covers multiple task categories"
    },
    "output_format": {
        "task": "Clear task description",
        "context": "Relevant background information",
        "expected_output": "Desired agent response",
        "tools_used": ["search", "visit"],
        "difficulty": "easy|medium|hard"
    }
}
```

### 5 Priority Agent Templates (Week 1)

**Templates Created:**
1. ✅ `qa_agent_template.txt` - Testing and quality assurance
2. ✅ `support_agent_template.txt` - Customer support automation
3. ✅ `legal_agent_template.txt` - Legal document review
4. ✅ `analyst_agent_template.txt` - Business analytics
5. ✅ `content_agent_template.txt` - Content generation

**Remaining 10 Agents (Week 2):**
- security_agent, builder_agent, deploy_agent, spec_agent, reflection_agent
- se_darwin_agent, waltzrl_conversation_agent, waltzrl_feedback_agent
- marketing_agent, orchestrator

---

## 20K Example Distribution Plan

### Overall Strategy

**Total Target:** 20,000 synthetic training examples
**Distribution:** 1,333 examples per agent × 15 agents ≈ 20,000 examples

### Per-Agent Breakdown

| Agent | Examples | Categories | Difficulty Split |
|-------|----------|------------|------------------|
| qa_agent | 1,333 | 5 (testing, bug detection, review, integration, performance) | Easy: 400, Medium: 600, Hard: 333 |
| support_agent | 1,333 | 5 (troubleshooting, escalation, documentation, onboarding, feedback) | Easy: 400, Medium: 600, Hard: 333 |
| legal_agent | 1,333 | 5 (contract review, compliance, risk assessment, IP, litigation support) | Easy: 400, Medium: 600, Hard: 333 |
| analyst_agent | 1,333 | 5 (data analysis, reporting, forecasting, KPI tracking, insights) | Easy: 400, Medium: 600, Hard: 333 |
| content_agent | 1,333 | 5 (writing, editing, SEO, social media, newsletters) | Easy: 400, Medium: 600, Hard: 333 |
| security_agent | 1,333 | 5 (vulnerability scanning, audit, incident response, compliance, pentesting) | Easy: 400, Medium: 600, Hard: 333 |
| builder_agent | 1,333 | 5 (infrastructure setup, deployment, scaling, monitoring, optimization) | Easy: 400, Medium: 600, Hard: 333 |
| deploy_agent | 1,333 | 5 (CI/CD, rollback, blue-green, canary, health checks) | Easy: 400, Medium: 600, Hard: 333 |
| spec_agent | 1,333 | 5 (requirements, architecture, API design, documentation, user stories) | Easy: 400, Medium: 600, Hard: 333 |
| reflection_agent | 1,333 | 5 (self-assessment, improvement, error analysis, learning, meta-cognition) | Easy: 400, Medium: 600, Hard: 333 |
| se_darwin_agent | 1,333 | 5 (evolution, mutation, selection, benchmarking, optimization) | Easy: 400, Medium: 600, Hard: 333 |
| waltzrl_conversation_agent | 1,333 | 5 (safety dialogue, refinement, nuance, helpfulness, alignment) | Easy: 400, Medium: 600, Hard: 333 |
| waltzrl_feedback_agent | 1,333 | 5 (harmful detection, PII redaction, constructive feedback, patterns, escalation) | Easy: 400, Medium: 600, Hard: 333 |
| marketing_agent | 1,333 | 5 (campaigns, copywriting, analytics, A/B testing, automation) | Easy: 400, Medium: 600, Hard: 333 |
| orchestrator | 1,333 | 5 (task decomposition, routing, validation, coordination, optimization) | Easy: 400, Medium: 600, Hard: 333 |

**Total: 19,995 examples ≈ 20,000**

### Quality Distribution

**Difficulty Levels:**
- **Easy (30%):** ~6,000 examples - Straightforward, single-step tasks
- **Medium (45%):** ~9,000 examples - Multi-step, requires reasoning
- **Hard (25%):** ~5,000 examples - Complex, multi-tool, edge cases

**Generation Mode:**
- **ReAct Mode (70%):** ~14,000 examples - Standard quality, efficient
- **IterResearch Mode (30%):** ~6,000 examples - Premium quality for hard tasks

### Generation Timeline

**Week 2 (Nov 1-8, 2025):**
- Days 1-2: Generate 5,000 examples (5 priority agents × 1,000 each)
- Days 3-4: Generate 7,500 examples (next 5 agents × 1,500 each)
- Days 5-6: Generate 7,500 examples (final 5 agents × 1,500 each)
- Day 7: Quality validation and Hudson audit

**Estimated Cost:**
- ReAct generation: 14,000 examples × $0.02/example = $280
- IterResearch generation: 6,000 examples × $0.06/example = $360
- **Total: ~$640 for 20K examples**

---

## Quality Validation

### Validation Criteria

**Hudson will audit examples for:**

1. **Task Clarity (≥90% score required)**
   - Task is specific and actionable
   - Context is sufficient for agent to execute
   - Expected output is well-defined

2. **Realism (≥90% score required)**
   - Reflects real-world agent use cases
   - Appropriate difficulty level
   - Practical tool usage

3. **Diversity (≥90% score required)**
   - Covers all task categories
   - Varied complexity levels
   - Different tool combinations

4. **Format Compliance (100% required)**
   - Valid JSON structure
   - All required fields present
   - Proper data types

### Automated Validation

**Script:** `scripts/validate_deepresearch_quality.py`

```python
def validate_example(example):
    """
    Validate a single training example.
    Returns: (is_valid, score, issues)
    """
    checks = {
        "has_task": "task" in example,
        "has_context": "context" in example,
        "has_output": "expected_output" in example,
        "task_length": len(example.get("task", "")) >= 20,
        "context_length": len(example.get("context", "")) >= 50,
        "output_length": len(example.get("expected_output", "")) >= 100,
        "has_difficulty": example.get("difficulty") in ["easy", "medium", "hard"],
        "has_tools": isinstance(example.get("tools_used"), list)
    }

    score = sum(checks.values()) / len(checks)
    issues = [k for k, v in checks.items() if not v]

    return all(checks.values()), score, issues
```

### Sampling Strategy

**Manual Review:**
- Review 100 examples per agent (1,500 total, 7.5% sampling)
- Focus on hard examples (higher risk of quality issues)
- Hudson audit report with scores and recommendations

---

## Integration with Unsloth Pipeline

### Data Flow

```
DeepResearch (20K examples)
  ↓
Convert to Unsloth format (JSONL)
  ↓
Unsloth Fine-Tuning Pipeline (existing)
  ↓
Tuned Gemini Models (15 agents)
```

### Format Conversion

**DeepResearch Output:**
```json
{
    "task": "Generate pytest test cases for a REST API endpoint",
    "context": "Python FastAPI application with /users endpoint...",
    "expected_output": "import pytest\n\ndef test_get_users():\n...",
    "difficulty": "medium",
    "tools_used": ["search", "visit"]
}
```

**Unsloth Format:**
```jsonl
{"messages": [{"role": "user", "content": "Task: Generate pytest test cases for a REST API endpoint\n\nContext: Python FastAPI application with /users endpoint..."}, {"role": "assistant", "content": "import pytest\n\ndef test_get_users():\n..."}]}
```

**Conversion Script:** `scripts/convert_deepresearch_to_unsloth.py` (Week 2)

---

## Troubleshooting

### Common Issues

#### 1. API Key Errors

**Symptom:** `Error: Invalid Google API key`

**Solutions:**
- Verify key is correct in `.env` file
- Check key has Search API enabled in Google Cloud Console
- Ensure billing is enabled on Google Cloud account
- Test key with: `curl "https://www.googleapis.com/customsearch/v1?key=YOUR_KEY"`

#### 2. Model Loading Failures

**Symptom:** `RuntimeError: CUDA out of memory`

**Solutions:**
- Use quantized model (8-bit or 4-bit)
- Reduce batch size
- Use CPU inference (slower but works)
- Ensure GPU has ≥24GB VRAM (A100/H100 recommended)

#### 3. Slow Generation

**Symptom:** Inference taking >60 seconds per example

**Solutions:**
- Use ReAct mode instead of IterResearch for bulk generation
- Reduce context length in prompts
- Use batch inference (process multiple examples in parallel)
- Consider using cloud GPU instances (Lambda Labs, RunPod)

---

## Next Steps

### Week 1 Remaining (Oct 31)
- ✅ Setup documentation complete
- ⏳ Create 5 agent prompt templates (in progress)
- ⏳ Document 20K distribution plan (in progress)
- ⏳ Create quality validation script stub

### Week 2 (Nov 1-8)
- Generate 20,000 synthetic examples using templates
- Run quality validation (automated + Hudson audit)
- Convert examples to Unsloth format
- Feed to fine-tuning pipeline

### Week 3 (Nov 11-15)
- Fine-tune all 15 Genesis agents
- Benchmark improvements
- Production deployment

---

## Resources

**Documentation:**
- DeepResearch README: `/home/genesis/genesis-rebuild/external/DeepResearch/README.md`
- Tech Report: `/home/genesis/genesis-rebuild/external/DeepResearch/Tech_Report.pdf`
- This Guide: `/home/genesis/genesis-rebuild/docs/DEEPRESEARCH_SETUP_REPORT.md`

**Code:**
- Inference Scripts: `/home/genesis/genesis-rebuild/external/DeepResearch/inference/`
- Templates: `/home/genesis/genesis-rebuild/data/deepresearch_prompts/`
- Validation: `/home/genesis/genesis-rebuild/scripts/validate_deepresearch_quality.py`

**External Links:**
- Model: https://huggingface.co/Alibaba-NLP/Tongyi-DeepResearch-30B-A3B
- Paper: https://arxiv.org/pdf/2510.24701
- Blog: https://tongyi-agent.github.io/blog/introducing-tongyi-deep-research/

---

**Last Updated:** October 31, 2025
**Version:** 1.0
**Status:** Week 1 In Progress - Templates Next
