# CODEX Task Assignment - ADP Pipeline Week 1

**OWNER:** Codex (AI Coding Agent)
**LEAD:** Claude Code (coordinating overall pipeline)
**PEER:** Cursor (working on validation & quality tasks)
**DEADLINE:** Complete by end of week (5 days)

---

## 🎯 YOUR PRIMARY MISSION

**Build the ADP Conversion Pipeline** - Convert 6,665 raw training examples from 5 agents into the standardized Agent Data Protocol (ADP) format.

**Why this matters:** ADP is the "interlingua" format that enables cross-agent learning. Without this, we can't create the 15×15 compatibility matrix for training Genesis agents.

---

## 📋 TASK BREAKDOWN

### TASK 1: Implement ADP Converter (Priority: HIGH)
**File:** `scripts/convert_deepresearch_to_adp.py`
**Status:** EXISTS but needs completion
**Your job:** Complete the conversion logic

**Input format (Raw JSONL):**
```json
{
  "task": "Debug authentication error in user login",
  "context": "User reports 401 errors when logging in with correct credentials...",
  "expected_output": "1. Check auth token expiration\n2. Verify HMAC signature...",
  "difficulty": "medium",
  "agent_name": "qa_agent",
  "category": "error_handling"
}
```

**Output format (ADP):**
```json
{
  "id": "qa_agent_001",
  "source_agent": "qa_agent",
  "task_type": "debugging",
  "difficulty": "medium",
  "input": {
    "prompt": "Debug authentication error in user login",
    "context": "User reports 401 errors...",
    "constraints": ["production environment", "no downtime allowed"]
  },
  "output": {
    "reasoning": "Step-by-step debugging approach...",
    "actions": ["Check auth token", "Verify signature"],
    "result": "Fixed: Token expiration window was too short"
  },
  "metadata": {
    "category": "error_handling",
    "tags": ["authentication", "debugging", "security"],
    "complexity_score": 6.5,
    "estimated_time_minutes": 30
  }
}
```

**Key requirements:**
1. Parse reasoning from `expected_output` (extract step-by-step logic)
2. Extract actions (verb phrases like "Check", "Verify", "Fix")
3. Auto-generate tags from task content (use keyword extraction)
4. Calculate complexity score based on:
   - Difficulty (easy=3-5, medium=5-8, hard=8-10)
   - Context length
   - Number of steps in reasoning

**Implementation guide:**
- Read from: `data/generated_examples/*_agent_examples.jsonl`
- Write to: `data/adp_format/*_agent_adp.jsonl`
- Use `anthropic` library for Claude Haiku 3.5 to extract reasoning/actions
- Process in batches of 100 for efficiency
- Add progress bar (tqdm)

**Test criteria:**
- Must process all 6,665 examples
- Must maintain 1:1 mapping (no data loss)
- Must pass schema validation (see docs/ADP_FORMAT_SPECIFICATION.md)

---

### TASK 2: Build ADP Validator (Priority: HIGH)
**File:** `scripts/validate_adp_quality.py`
**Your job:** Create comprehensive validation

**Validation checks:**
1. **Schema validation** - All required fields present
2. **Quality checks:**
   - `reasoning` has at least 3 steps
   - `actions` list is not empty
   - `tags` has 2-5 relevant keywords
   - `complexity_score` matches difficulty level
3. **Cross-agent consistency:**
   - Same difficulty levels have similar complexity scores
   - Tag vocabulary is consistent across agents
4. **Data integrity:**
   - No duplicate IDs
   - All source_agents valid (qa/support/legal/analyst/content)
   - Difficulty in ["easy", "medium", "hard"]

**Output report:**
```
=== ADP Validation Report ===
Total examples: 6,665
✅ Schema valid: 6,665 (100%)
✅ Quality checks passed: 6,543 (98.2%)
⚠️  Warnings: 122 (1.8%)
  - 45 examples: reasoning too short (<3 steps)
  - 77 examples: tags missing

Breakdown by agent:
  qa_agent: 1,333 examples (100% valid)
  support_agent: 1,333 examples (98% valid)
  ...

Recommendations:
  - Review 45 short reasoning examples
  - Add tags to 77 examples
```

**Test criteria:**
- Must catch all schema violations
- Must identify quality issues
- Must generate actionable report

---

### TASK 3: Create ADP Statistics Dashboard (Priority: MEDIUM)
**File:** `scripts/analyze_adp_stats.py`
**Your job:** Build analytics

**Generate these stats:**
1. **Distribution analysis:**
   - Difficulty breakdown (easy/medium/hard percentages)
   - Task type distribution
   - Category coverage
   - Complexity score distribution (histogram)

2. **Cross-agent comparison:**
   - Average complexity by agent
   - Tag overlap matrix (which agents share similar vocabularies)
   - Reasoning depth comparison

3. **Quality metrics:**
   - Average reasoning steps per difficulty
   - Tag diversity (unique tags per agent)
   - Context length statistics

**Output:** Markdown report to `reports/adp_statistics.md`

---

### TASK 4: Build Incremental Converter (Priority: LOW)
**File:** Update `convert_deepresearch_to_adp.py`
**Feature:** Resume capability

**Why:** If conversion fails midway (API errors, crashes), we don't want to reprocess everything.

**Implementation:**
- Check which files already exist in `data/adp_format/`
- Count lines in existing files
- Skip already-converted examples
- Add `--resume` flag

---

## 🔧 TECHNICAL DETAILS

**Dependencies:**
```bash
pip install anthropic tqdm jsonschema
```

**API Key:** Use the same Anthropic API key from environment
```python
from anthropic import Anthropic
import os
client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
```

**Model:** `claude-3-5-haiku-20241022` (cost-efficient)

**Rate limits:**
- Be mindful of API rate limits
- Add exponential backoff on 429 errors
- Consider batching prompts (10 examples per API call)

---

## 📊 SUCCESS CRITERIA

**DONE = All these complete:**
1. ✅ 6,665 examples converted to ADP format
2. ✅ All examples pass schema validation
3. ✅ Quality score ≥ 95% (≤5% warnings)
4. ✅ Statistics report generated
5. ✅ Code is documented and tested

---

## 🚦 PROGRESS TRACKING

**Update this section as you work:**

- [x] TASK 1: ADP Converter - COMPLETE
- [x] TASK 2: ADP Validator - COMPLETE
- [x] TASK 3: Statistics Dashboard - COMPLETE
- [x] TASK 4: Incremental Converter - COMPLETE

**Blockers:** (Document any issues here)

**Questions for Lead:** (Ask Claude Code if stuck)

---

## 📚 REFERENCE FILES

**Read these first:**
- `docs/ADP_FORMAT_SPECIFICATION.md` - Complete ADP schema
- `docs/ADP_CONVERSION_STRATEGY.md` - Conversion approach
- `docs/DEEPRESEARCH_20K_DISTRIBUTION_PLAN.md` - Overall pipeline plan
- `data/generated_examples/*.jsonl` - Input data (currently generating)

**Related work:**
- Claude Code: Generating raw examples (IN PROGRESS - 80% done)
- Cursor: Will validate quality and build Unsloth converter (PENDING)

---

## 💬 COORDINATION

**Communication protocol:**
1. Start each task by reading related docs
2. Write code with clear comments
3. Test on 10 examples before full run
4. Update progress in this file
5. Report blockers immediately to Lead (Claude Code)

**Git workflow:**
```bash
git checkout -b codex/adp-conversion
# ... do work ...
git add scripts/convert_deepresearch_to_adp.py
git commit -m "feat(codex): Implement ADP converter with reasoning extraction"
git push origin codex/adp-conversion
```

---

## 🎯 EXPECTED OUTPUT

**By end of week:**
```
data/adp_format/
├── qa_agent_adp.jsonl (1,333 lines)
├── support_agent_adp.jsonl (1,333 lines)
├── legal_agent_adp.jsonl (1,333 lines)
├── analyst_agent_adp.jsonl (1,333 lines)
└── content_agent_adp.jsonl (1,333 lines)

reports/
└── adp_statistics.md (comprehensive analysis)

scripts/
├── convert_deepresearch_to_adp.py (complete, tested)
├── validate_adp_quality.py (complete, tested)
└── analyze_adp_stats.py (complete, tested)
```

**Quality bar:**
- All code passes pylint with score ≥ 8.0
- All functions have docstrings
- All scripts have --help documentation
- All critical paths have error handling

---

**QUESTIONS? Ask Claude Code (Lead) in the main chat.**

### Dashboard Live Data Integration (2025-10-31)
- Replaced mock payloads in `public_demo/dashboard/components/*` with API-driven fetchers that fall back to sample data when endpoints are unavailable.
- Added shared helper `public_demo/dashboard/lib/api.ts` for fetch logic and numeric coercion.
- Updated Next.js rewrites plus README env docs for Prometheus/OTEL/log services.
- npm run lint/build now pass after installing missing dependencies (e.g. tailwindcss-animate).

### Socratic-Zero Bootstrap Improvements (2025-11-01)
- Regenerated analyst seeds and 5,100 bootstrap examples with richer deterministic templates when `OPENAI_API_KEY` is absent.
- Pipeline now produces multi-sentence reasoning/output, varied instructions/inputs, and timezone-aware timestamps.
- Quality validator reports Hudson 100% (format/content/diversity) and README documents offline mode.
