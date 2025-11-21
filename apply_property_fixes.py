#!/usr/bin/env python3
"""
Automatically fix StandardIntegrationMixin property conflicts in GenesisMetaAgent
by converting direct assignments to using _private variables
"""
import re
from pathlib import Path

# These properties from StandardIntegrationMixin conflict with __init__ assignments
CONFLICTING_PROPERTIES = [
    'socratic_zero', 'daao_router', 'agentscope_runtime', 'agentscope_alias',
    'memento_agent', 'aop_validator', 'casebank', 'webvoyager',
    'security_scanner', 'prometheus_metrics', 'reasoning_bank', 'replay_buffer',
    'omnidaemon_bridge', 'react_training', 'feature_flags', 'llm_judge_rl',
    'computer_use'
]

agent_file = Path("infrastructure/genesis_meta_agent.py")
content = agent_file.read_text()

# Create backup
backup_file = Path("infrastructure/genesis_meta_agent.py.backup")
backup_file.write_text(content)
print(f"Created backup at {backup_file}")

# Strategy: Replace self.PROPERTY = with self._PROPERTY_instance = in __init__ only
# This preserves the assignments but uses different variable names that don't conflict

# Find the __init__ method boundaries
init_start = content.find('def __init__(')
if init_start == -1:
    print("ERROR: Could not find __init__ method")
    exit(1)

# Find the end of __init__ (next method definition at same indentation)
init_end = content.find('\n    def ', init_start + 1)
if init_end == -1:
    init_end = len(content)

init_content = content[init_start:init_end]
before_init = content[:init_start]
after_init = content[init_end:]

# Replace each conflicting property assignment
fixes_applied = 0
for prop in CONFLICTING_PROPERTIES:
    pattern = rf'([ \t]*)self\.{prop}(\s*=)'
    replacement = rf'\1self._{prop}_instance\2'

    new_init, count = re.subn(pattern, replacement, init_content)
    if count > 0:
        print(f"  Fixed {count} occurrences of self.{prop}")
        init_content = new_init
        fixes_applied += count

# Reconstruct the file
new_content = before_init + init_content + after_init

# Write the fixed file
agent_file.write_text(new_content)

print(f"\n✅ Applied {fixes_applied} fixes to genesis_meta_agent.py")
print(f"   Backup saved to {backup_file}")
print(f"\nNOTE: Properties are now provided by StandardIntegrationMixin (lazy init)")
print(f"      The _instance variables are no longer used by the class")
