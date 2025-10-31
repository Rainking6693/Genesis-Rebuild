# ROGUE IMPLEMENTATION GUIDE - WEEKS 2-3

**Phase:** Implementation & CI/CD Integration (November 11-22, 2025)
**Owner:** Forge (lead), Alex (E2E validation)
**Status:** ⏳ PENDING (Starts Week 2)
**Prerequisite:** Week 1 Complete ✅

---

## WEEK 2: CORE IMPLEMENTATION (November 11-15, 2025)

### Day 1: Environment Setup

**Tasks:**
1. Install Rogue framework
2. Configure Genesis A2A endpoints
3. Verify connectivity

**Commands:**
```bash
# Install Rogue
cd /home/genesis
git clone https://github.com/qualifire-dev/rogue.git
cd rogue
uv sync

# Start Rogue server (Terminal 1)
uvx rogue-ai server  # Runs on port 8000

# Start Genesis A2A service (Terminal 2)
cd /home/genesis/genesis-rebuild
python -m infrastructure.a2a_service &  # Runs on port 8000

# Verify connectivity
curl http://localhost:8000/health
curl http://localhost:8000/a2a/qa_agent/health
```

**Success Criteria:**
- [ ] Rogue server running on port 8000
- [ ] Genesis A2A service running
- [ ] All 15 agents responding to /health checks
- [ ] No authentication errors

---

### Day 2-3: Build Rogue Runner Infrastructure

**Create:** `infrastructure/testing/rogue_runner.py`

**Core Functions:**
1. `load_scenarios(yaml_file)` - Parse YAML scenarios
2. `execute_scenario_batch(scenarios, agent_url)` - Run tests in parallel
3. `aggregate_results(results)` - Collect pass/fail stats
4. `generate_report(results, output_file)` - Create Markdown report
5. `track_costs(results)` - Calculate LLM usage costs

**Implementation Pattern:**
```python
# infrastructure/testing/rogue_runner.py

import asyncio
import yaml
import subprocess
from pathlib import Path
from typing import List, Dict
import json

class RogueRunner:
    """Orchestrates Rogue test execution for Genesis agents."""
    
    def __init__(self, rogue_server_url="http://localhost:8000"):
        self.rogue_server_url = rogue_server_url
        self.results = []
        self.total_cost = 0.0
    
    def load_scenarios(self, yaml_path: str) -> List[Dict]:
        """Load scenarios from YAML file."""
        with open(yaml_path, 'r') as f:
            data = yaml.safe_load(f)
        return data['scenarios']
    
    async def execute_scenario(self, scenario: Dict, agent_url: str) -> Dict:
        """Execute single scenario via Rogue CLI."""
        cmd = [
            "uvx", "rogue-ai", "cli",
            "--evaluated-agent-url", agent_url,
            "--judge-llm", "openai/gpt-4o",
            "--input-scenarios-file", f"./temp/{scenario['id']}.json",
            "--output-report-file", f"./reports/{scenario['id']}.md",
            "--business-context", scenario['description']
        ]
        
        # Write scenario to temp file
        temp_file = Path(f"./temp/{scenario['id']}.json")
        temp_file.parent.mkdir(exist_ok=True)
        temp_file.write_text(json.dumps([scenario]))
        
        # Execute Rogue CLI
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        # Parse results
        report_path = Path(f"./reports/{scenario['id']}.md")
        if report_path.exists():
            report = report_path.read_text()
            passed = "PASS" in report
        else:
            passed = False
        
        return {
            "scenario_id": scenario['id'],
            "passed": passed,
            "output": result.stdout,
            "cost": self._estimate_cost(scenario)
        }
    
    async def execute_scenario_batch(
        self, 
        scenarios: List[Dict], 
        agent_url: str,
        parallel: int = 5
    ) -> List[Dict]:
        """Execute scenarios in parallel batches."""
        results = []
        for i in range(0, len(scenarios), parallel):
            batch = scenarios[i:i+parallel]
            tasks = [
                self.execute_scenario(s, agent_url) for s in batch
            ]
            batch_results = await asyncio.gather(*tasks)
            results.extend(batch_results)
        return results
    
    def aggregate_results(self, results: List[Dict]) -> Dict:
        """Calculate pass/fail statistics."""
        total = len(results)
        passed = sum(1 for r in results if r['passed'])
        failed = total - passed
        pass_rate = (passed / total * 100) if total > 0 else 0
        total_cost = sum(r['cost'] for r in results)
        
        return {
            "total_scenarios": total,
            "passed": passed,
            "failed": failed,
            "pass_rate": pass_rate,
            "total_cost_usd": total_cost
        }
    
    def generate_report(self, results: List[Dict], output_path: str):
        """Generate Markdown summary report."""
        stats = self.aggregate_results(results)
        
        report = f"""# Rogue Test Results
        
## Summary
- **Total Scenarios:** {stats['total_scenarios']}
- **Passed:** {stats['passed']}
- **Failed:** {stats['failed']}
- **Pass Rate:** {stats['pass_rate']:.1f}%
- **Total Cost:** ${stats['total_cost_usd']:.2f}

## Failed Scenarios
"""
        for r in results:
            if not r['passed']:
                report += f"- `{r['scenario_id']}`: {r['output'][:100]}...\n"
        
        Path(output_path).write_text(report)
        print(f"Report generated: {output_path}")
    
    def _estimate_cost(self, scenario: Dict) -> float:
        """Estimate LLM cost for scenario."""
        priority = scenario.get('priority', 'P2')
        if priority == 'P0':
            return 0.06  # GPT-4o
        elif priority == 'P1':
            return 0.05  # GPT-4o
        else:
            return 0.001  # Gemini Flash
    
    async def run_full_suite(self, scenarios_dir: str, output_dir: str):
        """Run all scenarios for all agents."""
        scenario_files = Path(scenarios_dir).glob("*.yaml")
        
        for scenario_file in scenario_files:
            agent_name = scenario_file.stem.replace("_scenarios", "")
            agent_url = f"http://localhost:8000/a2a/{agent_name}"
            
            print(f"Testing {agent_name}...")
            scenarios = self.load_scenarios(scenario_file)
            results = await self.execute_scenario_batch(scenarios, agent_url)
            
            output_path = Path(output_dir) / f"{agent_name}_report.md"
            self.generate_report(results, output_path)
            
            self.results.extend(results)
        
        # Generate overall summary
        self.generate_report(
            self.results, 
            Path(output_dir) / "summary.md"
        )

# CLI entry point
async def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--scenarios-dir", required=True)
    parser.add_argument("--output-dir", default="./reports")
    parser.add_argument("--parallel", type=int, default=5)
    args = parser.parse_args()
    
    runner = RogueRunner()
    await runner.run_full_suite(args.scenarios_dir, args.output_dir)

if __name__ == "__main__":
    asyncio.run(main())
```

**Success Criteria:**
- [ ] `rogue_runner.py` created (~600 lines)
- [ ] All core functions implemented
- [ ] Unit tests written (20+ tests)
- [ ] Runs successfully with 1 agent (QA agent test)

---

### Day 4-5: Convert 500 P0/P1 Scenarios

**Priority:** Focus on P0 (critical) and P1 (important) scenarios first

**Distribution:**
- P0: 50 scenarios (10% of 500)
- P1: 450 scenarios (90% of 500)

**Conversion Process:**
1. Read scenarios from catalog (ROGUE_TEST_SCENARIOS_CATALOG.md)
2. Convert to Rogue YAML format
3. Validate YAML syntax
4. Test 10 scenarios manually

**Script to Generate Scenarios:**
```python
# scripts/generate_rogue_scenarios.py

import yaml
from pathlib import Path

def generate_agent_scenarios(agent_name, count=100):
    """Generate scenario YAML for an agent."""
    
    template = {
        "agent": {
            "name": agent_name,
            "url": f"http://localhost:8000/a2a/{agent_name}",
            "capabilities": [],
            "business_context": f"{agent_name} provides specialized services."
        },
        "scenarios": [],
        "judge_llm": {
            "model": "openai/gpt-4o",
            "fallback": "google/gemini-2.5-flash"
        },
        "cost_tracking": {
            "enabled": True,
            "target_cost_per_scenario": "$0.05"
        }
    }
    
    # Generate success cases (40%)
    for i in range(1, int(count * 0.4) + 1):
        scenario = {
            "id": f"{agent_name}_{i:03d}_success",
            "priority": "P1" if i > 5 else "P0",
            "category": "success",
            "tags": ["success", "core_functionality"],
            "description": f"Test {agent_name} core functionality #{i}",
            "input": {
                "task": f"Example task {i}"
            },
            "expected_output": {
                "status": "success",
                "response_time": "<5s"
            },
            "policy_checks": [
                "Response within SLO",
                "Valid output format",
                "No errors logged"
            ]
        }
        template["scenarios"].append(scenario)
    
    # Generate edge cases (30%)
    # Generate failure cases (20%)
    # Generate security cases (10%)
    # (Similar pattern for other categories)
    
    # Write to file
    output_path = Path(f"tests/rogue/scenarios/{agent_name}_scenarios.yaml")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_path, 'w') as f:
        yaml.dump(template, f, default_flow_style=False)
    
    print(f"Generated {output_path}")

# Generate for all 15 agents
agents = [
    "qa_agent", "support_agent", "legal_agent", "analyst_agent",
    "security_agent", "content_agent", "builder_agent", "deploy_agent",
    "spec_agent", "reflection_agent", "orchestration_agent", 
    "se_darwin_agent", "waltzrl_conversation_agent", 
    "waltzrl_feedback_agent", "vision_agent"
]

for agent in agents:
    generate_agent_scenarios(agent, count=100)
```

**Success Criteria:**
- [ ] 500 scenarios converted to YAML
- [ ] All YAML files valid
- [ ] 10 manual test runs successful
- [ ] Pass rate ≥75% (baseline)

---

## WEEK 3: CI/CD INTEGRATION (November 18-22, 2025)

### Day 1-2: GitHub Actions Workflow

**Create:** `.github/workflows/rogue_tests.yml`

**Workflow:**
```yaml
name: Rogue Automated Tests

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
  schedule:
    - cron: '0 2 * * *'  # 2 AM daily

jobs:
  rogue-tests:
    runs-on: ubuntu-latest
    timeout-minutes: 45
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Python 3.12
        uses: actions/setup-python@v4
        with:
          python-version: '3.12'
      
      - name: Install dependencies
        run: |
          pip install uv
          git clone https://github.com/qualifire-dev/rogue.git
          cd rogue && uv sync
      
      - name: Start Rogue Server
        run: |
          uvx rogue-ai server &
          sleep 10
      
      - name: Start Genesis A2A Service
        run: |
          python -m infrastructure.a2a_service &
          sleep 5
      
      - name: Run Rogue Tests
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
        run: |
          python infrastructure/testing/rogue_runner.py \
            --scenarios-dir tests/rogue/scenarios/ \
            --output-dir reports/rogue/ \
            --parallel 5
      
      - name: Check Pass Rate
        run: |
          PASS_RATE=$(python scripts/calculate_pass_rate.py reports/rogue/)
          echo "Pass rate: $PASS_RATE%"
          if (( $(echo "$PASS_RATE < 95.0" | bc -l) )); then
            echo "FAIL: Pass rate below 95% threshold"
            exit 1
          fi
      
      - name: Upload Reports
        uses: actions/upload-artifact@v3
        with:
          name: rogue-reports
          path: reports/rogue/
      
      - name: Comment on PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const summary = fs.readFileSync('reports/rogue/summary.md', 'utf8');
            await github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## Rogue Test Results\n\n${summary}`
            });
```

**Success Criteria:**
- [ ] Workflow file created
- [ ] Runs successfully on test branch
- [ ] Reports uploaded to artifacts
- [ ] PR comments working
- [ ] Pass rate gate enforced

---

### Day 3-4: Complete Remaining 1,000 Scenarios

**Tasks:**
1. Generate remaining P2 scenarios (1,000 scenarios)
2. Run full 1,500 scenario suite
3. Debug failures
4. Achieve ≥95% pass rate

**Commands:**
```bash
# Generate all remaining scenarios
python scripts/generate_rogue_scenarios.py --count 1500

# Run full suite
python infrastructure/testing/rogue_runner.py \
  --scenarios-dir tests/rogue/scenarios/ \
  --output-dir reports/rogue/ \
  --parallel 5

# Check results
cat reports/rogue/summary.md
```

**Success Criteria:**
- [ ] All 1,500 scenarios generated
- [ ] Full suite runs in <30 minutes
- [ ] Pass rate ≥95%
- [ ] Cost per run <$30

---

### Day 5: Documentation & Handoff

**Create:**
1. `docs/ROGUE_MAINTENANCE_GUIDE.md` - How to add new scenarios
2. `docs/ROGUE_TESTING_REPORT.md` - Final coverage analysis
3. Update PROJECT_STATUS.md

**Maintenance Guide Contents:**
```markdown
# Adding New Rogue Test Scenarios

## Step 1: Define Scenario
Edit `tests/rogue/scenarios/{agent}_scenarios.yaml`:
- Add new scenario with unique ID
- Set priority (P0/P1/P2)
- Define input, expected output, policy checks

## Step 2: Validate
python scripts/validate_scenario.py \
  tests/rogue/scenarios/{agent}_scenarios.yaml

## Step 3: Test Locally
python infrastructure/testing/rogue_runner.py \
  --scenarios-dir tests/rogue/scenarios/ \
  --output-dir reports/

## Step 4: Commit & Push
git add tests/rogue/scenarios/
git commit -m "Add scenario {agent}_{id}"
git push origin feature-branch

## Step 5: CI/CD Validation
GitHub Actions will run automatically on PR
```

**Success Criteria:**
- [ ] Maintenance guide created
- [ ] Testing report finalized
- [ ] PROJECT_STATUS.md updated
- [ ] All documentation complete

---

## SUCCESS METRICS

### Week 2 Targets
- [ ] Rogue runner infrastructure complete (~600 lines)
- [ ] 500 P0/P1 scenarios converted
- [ ] Baseline pass rate ≥85%
- [ ] Cost per run <$30

### Week 3 Targets
- [ ] GitHub Actions workflow operational
- [ ] All 1,500 scenarios complete
- [ ] Pass rate ≥95%
- [ ] Runtime <30 minutes
- [ ] Documentation complete

### Overall Success
- [ ] 1,500+ scenarios automated
- [ ] CI/CD blocking on failures
- [ ] Zero manual testing overhead
- [ ] $400-500/month cost achieved

---

## TROUBLESHOOTING

### Common Issues

**Issue 1: Rogue server won't start**
```bash
# Check if port 8000 is in use
lsof -i :8000
kill -9 <PID>

# Restart server
uvx rogue-ai server
```

**Issue 2: A2A authentication failures**
```bash
# Verify agent registry
python -c "from infrastructure.agent_auth_registry import AgentAuthRegistry; r = AgentAuthRegistry(); print(r.list_agents())"

# Regenerate token
python scripts/regenerate_a2a_token.py qa_agent
```

**Issue 3: High failure rate**
```bash
# Check agent health
curl http://localhost:8000/a2a/qa_agent/health

# Review failed scenarios
grep "FAIL" reports/rogue/summary.md

# Debug single scenario
uvx rogue-ai cli \
  --evaluated-agent-url http://localhost:8000/a2a/qa_agent \
  --judge-llm openai/gpt-4o \
  --input-scenarios-file tests/rogue/scenarios/qa_001.json \
  --output-report-file reports/debug.md
```

---

**Document Status:** DRAFT - Ready for Week 2 execution
**Next Update:** After Week 2 completion (November 15, 2025)
**Owner:** Forge (implementation), Alex (validation)

---

**END OF IMPLEMENTATION GUIDE**
