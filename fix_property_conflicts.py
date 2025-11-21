#!/usr/bin/env python3
"""
Fix StandardIntegrationMixin property conflicts in GenesisMetaAgent.__init__
"""
import re
from pathlib import Path

# Get all properties from StandardIntegrationMixin
mixin_file = Path("infrastructure/standard_integration_mixin.py")
mixin_content = mixin_file.read_text()

# Extract property names
property_pattern = r'@property\s+def\s+(\w+)\(self\)'
properties = set(re.findall(property_pattern, mixin_content))

print(f"Found {len(properties)} properties in StandardIntegrationMixin")

# Read GenesisMetaAgent file
agent_file = Path("infrastructure/genesis_meta_agent.py")
agent_content = agent_file.read_text()

# Find all assignments to self.PROPERTY in __init__
conflicts_found = []
for prop in properties:
    pattern = rf'self\.{prop}\s*='
    matches = list(re.finditer(pattern, agent_content))
    if matches:
        conflicts_found.append((prop, len(matches)))
        print(f"  Conflict: self.{prop} = ... ({len(matches)} occurrences)")

print(f"\nTotal conflicts: {len(conflicts_found)}")
print(f"\nConflicting properties: {[p[0] for p in conflicts_found]}")
