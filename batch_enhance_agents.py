#!/usr/bin/env python3
"""
Batch Enhancement Script for Genesis Agents
Adds DAAO routing + TUMIX termination to all remaining agents
"""

import re
from pathlib import Path

# Define agents to enhance
AGENTS_TO_ENHANCE = [
    'seo_agent.py',
    'email_agent.py',
    'legal_agent.py',
    'billing_agent.py',
    'maintenance_agent.py',
    'onboarding_agent.py',
    'support_agent.py',
    'builder_agent_enhanced.py'
]

AGENTS_DIR = Path('/home/genesis/genesis-rebuild/agents')

# Template for imports to add
IMPORT_TEMPLATE = """
# Import DAAO and TUMIX
from infrastructure.daao_router import get_daao_router, RoutingDecision
from infrastructure.tumix_termination import (
    get_tumix_termination,
    RefinementResult,
    TerminationDecision
)
"""

# Template for __init__ additions
INIT_TEMPLATE = """
        # Initialize DAAO router for cost optimization
        self.router = get_daao_router()

        # Initialize TUMIX for iterative refinement
        self.termination = get_tumix_termination(
            min_rounds=2,
            max_rounds=4,
            improvement_threshold=0.05
        )

        # Track refinement sessions for metrics
        self.refinement_history: List[List[RefinementResult]] = []

        logger.info(f"{{agent_name}} v4.0 initialized with DAAO + TUMIX for business: {{business_id}}")
"""

# Template for helper methods
HELPER_METHODS_TEMPLATE = """
    def route_task(self, task_description: str, priority: float = 0.5) -> RoutingDecision:
        \"\"\"
        Route task to appropriate model using DAAO

        Args:
            task_description: Description of the task
            priority: Task priority (0.0-1.0)

        Returns:
            RoutingDecision with model selection and cost estimate
        \"\"\"
        task = {
            'id': f'{{agent_id}}-{{datetime.now().strftime("%Y%m%d%H%M%S")}}',
            'description': task_description,
            'priority': priority,
            'required_tools': []
        }

        decision = self.router.route_task(task, budget_conscious=True)

        logger.info(
            f"Task routed: {decision.reasoning}",
            extra={
                'agent': '{{agent_class}}',
                'model': decision.model,
                'difficulty': decision.difficulty.value,
                'estimated_cost': decision.estimated_cost
            }
        )

        return decision

    def get_cost_metrics(self) -> Dict:
        \"\"\"Get cumulative cost savings from DAAO and TUMIX\"\"\"
        if not self.refinement_history:
            return {
                'agent': '{{agent_class}}',
                'tumix_sessions': 0,
                'tumix_savings_percent': 0.0,
                'message': 'No refinement sessions recorded yet'
            }

        tumix_savings = self.termination.estimate_cost_savings(
            [
                [r for r in session]
                for session in self.refinement_history
            ],
            cost_per_round=0.001
        )

        return {
            'agent': '{{agent_class}}',
            'tumix_sessions': tumix_savings['sessions'],
            'tumix_baseline_rounds': tumix_savings['baseline_rounds'],
            'tumix_actual_rounds': tumix_savings['tumix_rounds'],
            'tumix_savings_percent': tumix_savings['savings_percent'],
            'tumix_total_saved': tumix_savings['savings'],
            'daao_info': 'DAAO routing automatically applied to all tasks'
        }
"""


def enhance_agent(agent_file: Path) -> dict:
    """
    Enhance a single agent file with DAAO + TUMIX

    Returns:
        dict with enhancement status
    """
    print(f"\n=== Enhancing {agent_file.name} ===")

    try:
        content = agent_file.read_text()
        original_lines = len(content.splitlines())

        # Check if already enhanced
        if 'get_daao_router' in content and 'get_tumix_termination' in content:
            print(f"  ✓ Already enhanced (skipping)")
            return {
                'file': agent_file.name,
                'status': 'already_enhanced',
                'lines_added': 0
            }

        # Extract agent class name
        class_match = re.search(r'class (\w+Agent)', content)
        if not class_match:
            print(f"  ✗ Could not find agent class name")
            return {
                'file': agent_file.name,
                'status': 'error',
                'error': 'No agent class found'
            }

        agent_class = class_match.group(1)
        agent_id = agent_class.lower().replace('agent', '')

        # Step 1: Update imports
        if 'import logging' not in content:
            content = content.replace('import json', 'import json\nimport logging')

        if 'from typing import' in content and 'List' not in content:
            content = re.sub(
                r'from typing import ([^\n]+)',
                r'from typing import \1, List',
                content
            )

        # Add DAAO/TUMIX imports after existing imports
        import_section_end = content.rfind('setup_observability')
        if import_section_end != -1:
            before_setup = content[:import_section_end]
            after_setup = content[import_section_end:]

            if 'logger = logging.getLogger' not in after_setup:
                after_setup = after_setup.replace(
                    'setup_observability(enable_sensitive_data=True)',
                    f'setup_observability(enable_sensitive_data=True){IMPORT_TEMPLATE}\nlogger = logging.getLogger(__name__)'
                )
            else:
                after_setup = after_setup.replace(
                    'setup_observability(enable_sensitive_data=True)',
                    f'setup_observability(enable_sensitive_data=True){IMPORT_TEMPLATE}'
                )

            content = before_setup + after_setup

        # Step 2: Update version in docstring
        content = re.sub(
            r'Version: 3\.0',
            'Version: 4.0 (Enhanced with DAAO + TUMIX)',
            content
        )

        # Step 3: Enhance __init__ method
        init_pattern = r'(def __init__\(self[^)]*\):.*?)(async def initialize|def \w+\()'

        def add_init_enhancements(match):
            init_section = match.group(1)
            next_method = match.group(2)

            # Add enhancements before the next method
            enhanced_init = init_section.rstrip()
            enhanced_init += f"\n{INIT_TEMPLATE}"
            enhanced_init += f"\n    {next_method}"

            return enhanced_init

        content = re.sub(init_pattern, add_init_enhancements, content, flags=re.DOTALL)

        # Step 4: Add helper methods before factory function
        factory_pattern = r'(\n\nasync def get_\w+_agent|def get_\w+_agent)'

        helper_methods = HELPER_METHODS_TEMPLATE.replace(
            '{{agent_class}}', agent_class
        ).replace(
            '{{agent_id}}', agent_id
        )

        content = re.sub(
            factory_pattern,
            f'\n{helper_methods}\n\\1',
            content
        )

        # Write enhanced content
        agent_file.write_text(content)

        new_lines = len(content.splitlines())
        lines_added = new_lines - original_lines

        print(f"  ✓ Enhanced successfully")
        print(f"    - Lines added: {lines_added}")
        print(f"    - Agent class: {agent_class}")

        return {
            'file': agent_file.name,
            'status': 'success',
            'agent_class': agent_class,
            'lines_added': lines_added,
            'original_lines': original_lines,
            'new_lines': new_lines
        }

    except Exception as e:
        print(f"  ✗ Error: {str(e)}")
        return {
            'file': agent_file.name,
            'status': 'error',
            'error': str(e)
        }


def main():
    """Main batch enhancement process"""
    print("=" * 60)
    print("GENESIS AGENT BATCH ENHANCEMENT")
    print("Adding DAAO routing + TUMIX termination")
    print("=" * 60)

    results = []

    for agent_name in AGENTS_TO_ENHANCE:
        agent_file = AGENTS_DIR / agent_name

        if not agent_file.exists():
            print(f"\n⚠️  {agent_name} not found, skipping...")
            results.append({
                'file': agent_name,
                'status': 'not_found'
            })
            continue

        result = enhance_agent(agent_file)
        results.append(result)

    # Print summary
    print("\n" + "=" * 60)
    print("ENHANCEMENT SUMMARY")
    print("=" * 60)

    success_count = sum(1 for r in results if r['status'] == 'success')
    already_enhanced = sum(1 for r in results if r['status'] == 'already_enhanced')
    errors = sum(1 for r in results if r['status'] == 'error')
    total_lines_added = sum(r.get('lines_added', 0) for r in results)

    print(f"\nTotal agents processed: {len(results)}")
    print(f"  ✓ Successfully enhanced: {success_count}")
    print(f"  ⊙ Already enhanced: {already_enhanced}")
    print(f"  ✗ Errors: {errors}")
    print(f"  + Total lines added: {total_lines_added}")

    print("\nDetailed results:")
    for result in results:
        status_icon = {
            'success': '✓',
            'already_enhanced': '⊙',
            'error': '✗',
            'not_found': '?'
        }.get(result['status'], '?')

        print(f"  {status_icon} {result['file']}: {result['status']}")
        if result.get('lines_added'):
            print(f"      Lines added: {result['lines_added']}")

    print("\n" + "=" * 60)
    print("Enhancement complete!")
    print("=" * 60)


if __name__ == '__main__':
    main()
