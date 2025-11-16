#!/usr/bin/env python3
"""
Agent API Audit Script

Systematically audits all 25 agent APIs to document:
- Class name
- Constructor parameters
- Public methods and their signatures
- Any API inconsistencies
"""

import ast
import inspect
import json
import sys
from pathlib import Path
from typing import Dict, List, Any

# Add project root to path
sys.path.insert(0, str(Path(__file__).parent.parent))


class AgentAPIAuditor:
    """Audits agent APIs by parsing source code."""

    def __init__(self):
        self.agents_dir = Path(__file__).parent.parent / "agents"
        self.audit_results = {}

    def audit_all_agents(self) -> Dict[str, Any]:
        """Audit all agents in the agents directory."""
        agent_files = [
            "business_generation_agent.py",
            "deploy_agent.py",
            "database_design_agent.py",
            "api_design_agent.py",
            "stripe_integration_agent.py",
            "auth0_integration_agent.py",
            "content_creation_agent.py",
            "seo_optimization_agent.py",
            "email_marketing_agent.py",
            "marketing_agent_multimodal.py",
            "uiux_design_agent.py",
            "support_agent.py",
            "analytics_agent.py",
            "monitoring_agent.py",
            "qa_agent.py",
            "code_review_agent.py",
            "documentation_agent.py",
            "data_juicer_agent.py",
            "react_training_agent.py",
            "se_darwin_agent.py",
            "gemini_computer_use_agent.py",
            "async_think_agent.py",
            "rifl_agent.py",
            "auditor_agent.py",
            "business_monitor.py",
        ]

        for agent_file in agent_files:
            agent_path = self.agents_dir / agent_file
            if agent_path.exists():
                try:
                    self.audit_results[agent_file] = self.audit_agent_file(agent_path)
                except Exception as e:
                    self.audit_results[agent_file] = {
                        "error": str(e),
                        "status": "failed"
                    }
            else:
                self.audit_results[agent_file] = {
                    "error": "File not found",
                    "status": "missing"
                }

        return self.audit_results

    def audit_agent_file(self, file_path: Path) -> Dict[str, Any]:
        """Audit a single agent file."""
        with open(file_path, 'r') as f:
            source = f.read()

        tree = ast.parse(source)

        # Find the main agent class
        classes = [node for node in ast.walk(tree) if isinstance(node, ast.ClassDef)]

        # Find the primary agent class (usually the one without "Memory" or "Tool" in name)
        agent_class = None
        for cls in classes:
            if "Agent" in cls.name and "Memory" not in cls.name and "Tool" not in cls.name:
                agent_class = cls
                break

        if not agent_class:
            return {"error": "No agent class found", "status": "no_class"}

        # Extract class info
        result = {
            "status": "success",
            "class_name": agent_class.name,
            "constructor": self.extract_constructor(agent_class),
            "public_methods": self.extract_public_methods(agent_class),
            "factory_functions": self.extract_factory_functions(tree),
        }

        return result

    def extract_constructor(self, class_node: ast.ClassDef) -> Dict[str, Any]:
        """Extract constructor signature."""
        for node in class_node.body:
            if isinstance(node, ast.FunctionDef) and node.name == "__init__":
                args = []
                defaults = []

                # Get argument names
                for arg in node.args.args:
                    if arg.arg != "self":
                        args.append(arg.arg)

                # Get default values
                for default in node.args.defaults:
                    if isinstance(default, ast.Constant):
                        defaults.append(default.value)
                    elif isinstance(default, ast.Name):
                        defaults.append(default.id)
                    else:
                        defaults.append("complex_default")

                # Match args with defaults (defaults align from the right)
                params = {}
                num_defaults = len(defaults)
                for i, arg in enumerate(args):
                    default_idx = i - (len(args) - num_defaults)
                    if default_idx >= 0:
                        params[arg] = {"default": defaults[default_idx]}
                    else:
                        params[arg] = {"required": True}

                return {
                    "signature": f"__init__(self, {', '.join(args)})",
                    "parameters": params
                }

        return {"error": "No __init__ found"}

    def extract_public_methods(self, class_node: ast.ClassDef) -> List[Dict[str, Any]]:
        """Extract all public methods (not starting with _)."""
        methods = []

        for node in class_node.body:
            if isinstance(node, ast.FunctionDef):
                if not node.name.startswith("_"):
                    args = [arg.arg for arg in node.args.args if arg.arg != "self"]

                    # Check if async
                    is_async = isinstance(node, ast.AsyncFunctionDef)

                    # Get docstring
                    docstring = ast.get_docstring(node)

                    methods.append({
                        "name": node.name,
                        "async": is_async,
                        "parameters": args,
                        "signature": f"{'async ' if is_async else ''}{node.name}({', '.join(args)})",
                        "docstring": docstring[:100] if docstring else None
                    })

        return methods

    def extract_factory_functions(self, tree: ast.Module) -> List[str]:
        """Extract factory functions (get_* or create_*)."""
        factories = []

        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                if node.name.startswith("get_") or node.name.startswith("create_"):
                    if "agent" in node.name.lower():
                        factories.append(node.name)

        return factories


def main():
    """Run the audit and output results."""
    print("=" * 80)
    print("AGENT API AUDIT")
    print("=" * 80)

    auditor = AgentAPIAuditor()
    results = auditor.audit_all_agents()

    # Print summary
    successful = sum(1 for r in results.values() if r.get("status") == "success")
    failed = sum(1 for r in results.values() if r.get("status") in ["failed", "no_class"])
    missing = sum(1 for r in results.values() if r.get("status") == "missing")

    print(f"\nAudit Summary:")
    print(f"  Successful: {successful}/25")
    print(f"  Failed: {failed}/25")
    print(f"  Missing: {missing}/25")

    # Print detailed results
    print("\n" + "=" * 80)
    print("DETAILED RESULTS")
    print("=" * 80)

    for agent_file, result in results.items():
        print(f"\n{agent_file}:")

        if result.get("status") != "success":
            print(f"  Status: {result.get('status')}")
            print(f"  Error: {result.get('error')}")
            continue

        print(f"  Class: {result['class_name']}")
        print(f"  Constructor: {result['constructor'].get('signature', 'N/A')}")
        print(f"  Public Methods: {len(result['public_methods'])}")

        for method in result['public_methods'][:5]:  # Show first 5
            print(f"    - {method['signature']}")

        if len(result['public_methods']) > 5:
            print(f"    ... and {len(result['public_methods']) - 5} more")

        if result['factory_functions']:
            print(f"  Factory Functions: {', '.join(result['factory_functions'])}")

    # Save to JSON
    output_file = Path(__file__).parent.parent / "reports" / "agent_api_audit.json"
    output_file.parent.mkdir(exist_ok=True)

    with open(output_file, 'w') as f:
        json.dump(results, f, indent=2)

    print(f"\n✓ Full audit saved to: {output_file}")

    return results


if __name__ == "__main__":
    main()
