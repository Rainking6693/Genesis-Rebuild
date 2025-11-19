#!/usr/bin/env python3
"""
Audit integrations between MISSING_241_INTEGRATIONS.txt and standard_integration_mixin.py
to identify duplicates and create a file with non-duplicates.
"""

import re
from pathlib import Path
from typing import Set, List, Tuple


def extract_missing_integrations(file_path: str) -> Set[str]:
    """Extract integration names from MISSING_241_INTEGRATIONS.txt"""
    integrations = set()

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern: numbered lines like "1. integration_name"
    # We extract the integration name (everything between the number and newline/File:)
    pattern = r'^\d+\.\s+([a-z_0-9]+)\s*$'

    for line in content.split('\n'):
        match = re.match(pattern, line.strip())
        if match:
            integration_name = match.group(1)
            integrations.add(integration_name)

    return integrations


def extract_mixin_integrations(file_path: str) -> Set[str]:
    """Extract integration names from standard_integration_mixin.py"""
    integrations = set()

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Look for patterns like:
    # 1. @lazy_import('module_name')  or @lazy_import("module_name")
    # 2. def module_name(self): property definitions
    # 3. from ... import module_name

    # Pattern 1: @lazy_import decorators
    lazy_import_pattern = r'@lazy_import\(["\']([a-z_0-9\.]+)["\']\)'
    for match in re.finditer(lazy_import_pattern, content):
        module_path = match.group(1)
        # Extract the last part (actual module name)
        integration_name = module_path.split('.')[-1]
        integrations.add(integration_name)

    # Pattern 2: Property method definitions (def method_name(self):)
    # that are likely integration accessors
    property_pattern = r'@property\s+def\s+([a-z_][a-z_0-9]*)\s*\('
    for match in re.finditer(property_pattern, content):
        integration_name = match.group(1)
        integrations.add(integration_name)

    # Pattern 3: Look for actual attribute assignments or imports
    # This catches lines like: self._integration_name = ...
    attr_pattern = r'self\._([a-z_][a-z_0-9]*)\s*='
    for match in re.finditer(attr_pattern, content):
        integration_name = match.group(1)
        integrations.add(integration_name)

    return integrations


def analyze_integrations() -> Tuple[Set[str], Set[str], Set[str], Set[str]]:
    """
    Analyze integrations and return:
    - missing_only: integrations only in MISSING file
    - mixin_only: integrations only in mixin file
    - duplicates: integrations in both files
    - all_unique: all unique integrations (non-duplicates)
    """
    missing_file = "MISSING_241_INTEGRATIONS.txt"
    mixin_file = "standard_integration_mixin.py"

    print(f"Reading {missing_file}...")
    missing_integrations = extract_missing_integrations(missing_file)
    print(f"Found {len(missing_integrations)} integrations in MISSING file")

    print(f"\nReading {mixin_file}...")
    mixin_integrations = extract_mixin_integrations(mixin_file)
    print(f"Found {len(mixin_integrations)} integrations in mixin file")

    # Find duplicates and unique
    duplicates = missing_integrations & mixin_integrations
    missing_only = missing_integrations - mixin_integrations
    mixin_only = mixin_integrations - missing_integrations
    all_unique = (missing_integrations | mixin_integrations) - duplicates

    return missing_only, mixin_only, duplicates, all_unique


def generate_report(missing_only: Set[str], mixin_only: Set[str],
                   duplicates: Set[str], all_unique: Set[str]):
    """Generate detailed audit report"""

    print("\n" + "="*80)
    print("INTEGRATION AUDIT REPORT")
    print("="*80)

    print(f"\n📊 SUMMARY:")
    print(f"   Integrations in MISSING file only:  {len(missing_only)}")
    print(f"   Integrations in Mixin file only:    {len(mixin_only)}")
    print(f"   Duplicates (in both files):         {len(duplicates)}")
    print(f"   Total unique integrations:          {len(missing_only) + len(mixin_only)}")
    print(f"   Total all integrations:             {len(missing_only) + len(mixin_only) + len(duplicates)}")

    if duplicates:
        print(f"\n⚠️  DUPLICATES FOUND ({len(duplicates)}):")
        for dup in sorted(duplicates):
            print(f"   - {dup}")

    print(f"\n✅ NON-DUPLICATES ({len(missing_only) + len(mixin_only)}):")
    print(f"   These integrations appear in only one file")

    # Create output file with non-duplicates
    output_file = "UNIQUE_INTEGRATIONS.txt"
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("# UNIQUE INTEGRATIONS (NO DUPLICATES)\n")
        f.write(f"# Total: {len(missing_only) + len(mixin_only)}\n")
        f.write("#\n")
        f.write(f"# From MISSING_241_INTEGRATIONS.txt only: {len(missing_only)}\n")
        f.write(f"# From standard_integration_mixin.py only: {len(mixin_only)}\n")
        f.write("#\n\n")

        f.write("## FROM MISSING_241_INTEGRATIONS.txt ONLY:\n\n")
        for i, integration in enumerate(sorted(missing_only), 1):
            f.write(f"{i}. {integration}\n")

        f.write(f"\n## FROM standard_integration_mixin.py ONLY:\n\n")
        for i, integration in enumerate(sorted(mixin_only), 1):
            f.write(f"{i}. {integration}\n")

    print(f"\n📄 Output written to: {output_file}")

    # Expected total check
    expected_total = 455
    actual_total = len(missing_only) + len(mixin_only) + len(duplicates)

    print(f"\n🎯 VERIFICATION:")
    print(f"   Expected total integrations: {expected_total}")
    print(f"   Actual total integrations:   {actual_total}")

    if actual_total == expected_total:
        print(f"   ✅ COUNT MATCHES!")
    else:
        diff = expected_total - actual_total
        print(f"   ⚠️  MISMATCH: {abs(diff)} integrations {'missing' if diff > 0 else 'extra'}")


if __name__ == "__main__":
    missing_only, mixin_only, duplicates, all_unique = analyze_integrations()
    generate_report(missing_only, mixin_only, duplicates, all_unique)
