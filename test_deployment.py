#!/usr/bin/env python3
"""
Deployment Test Script for Day 4 Components
Tests actual deployment scenarios
"""

import sys
import traceback

def test_imports():
    """Test 1: All imports work"""
    print("\n=== TEST 1: Import Tests ===")
    issues = []

    tests = [
        ("Intent Layer", "from infrastructure.intent_layer import get_intent_layer"),
        ("Reflection Harness", "from infrastructure.reflection_harness import ReflectionHarness"),
        ("Spec Agent", "from agents.spec_agent import SpecAgent"),
        ("Deploy Agent", "from agents.deploy_agent import DeployAgent"),
        ("Security Agent", "from agents.security_agent import EnhancedSecurityAgent"),
    ]

    for name, import_stmt in tests:
        try:
            exec(import_stmt)
            print(f"✅ {name}: Import successful")
        except Exception as e:
            print(f"❌ {name}: Import FAILED - {str(e)}")
            issues.append(f"CRITICAL: {name} import failed - {str(e)}")

    return issues

def test_basic_initialization():
    """Test 2: Basic initialization"""
    print("\n=== TEST 2: Basic Initialization ===")
    issues = []

    # Test IntentExtractor
    try:
        from infrastructure.intent_layer import IntentExtractor
        extractor = IntentExtractor()
        print(f"✅ IntentExtractor initialized")
    except Exception as e:
        print(f"❌ IntentExtractor initialization FAILED: {str(e)}")
        issues.append(f"HIGH: IntentExtractor initialization failed - {str(e)}")

    # Test ReflectionHarness
    try:
        from infrastructure.reflection_harness import ReflectionHarness

        def sample_func(x: int) -> int:
            return x * 2

        harness = ReflectionHarness()
        wrapped = harness.wrap(sample_func)
        result = wrapped(5)

        if result == 10:
            print(f"✅ ReflectionHarness works (got {result})")
        else:
            print(f"❌ ReflectionHarness wrong result: expected 10, got {result}")
            issues.append(f"HIGH: ReflectionHarness returns wrong result")
    except Exception as e:
        print(f"❌ ReflectionHarness test FAILED: {str(e)}")
        issues.append(f"HIGH: ReflectionHarness test failed - {str(e)}")

    # Test SpecAgent
    try:
        from agents.spec_agent import SpecAgent
        agent = SpecAgent()
        stats = agent.get_statistics()
        print(f"✅ SpecAgent initialized (stats: {stats})")
    except Exception as e:
        print(f"❌ SpecAgent initialization FAILED: {str(e)}")
        issues.append(f"HIGH: SpecAgent initialization failed - {str(e)}")

    # Test DeployAgent
    try:
        from agents.deploy_agent import DeployAgent
        agent = DeployAgent()
        config = agent.get_config()
        print(f"✅ DeployAgent initialized (config keys: {list(config.keys())})")
    except Exception as e:
        print(f"❌ DeployAgent initialization FAILED: {str(e)}")
        issues.append(f"HIGH: DeployAgent initialization failed - {str(e)}")

    # Test SecurityAgent
    try:
        from agents.security_agent import EnhancedSecurityAgent
        agent = EnhancedSecurityAgent()
        metrics = agent.get_metrics()
        print(f"✅ EnhancedSecurityAgent initialized (metrics: {metrics})")
    except Exception as e:
        print(f"❌ EnhancedSecurityAgent initialization FAILED: {str(e)}")
        issues.append(f"HIGH: EnhancedSecurityAgent initialization failed - {str(e)}")

    return issues

def test_intent_extraction():
    """Test 3: Intent extraction functionality"""
    print("\n=== TEST 3: Intent Extraction ===")
    issues = []

    try:
        from infrastructure.intent_layer import IntentExtractor
        extractor = IntentExtractor()

        test_command = "Build a SaaS app for project management"
        intent = extractor.extract_intent(test_command)

        if intent:
            print(f"✅ Intent extracted successfully")
            print(f"   Action: {intent.action}")
            print(f"   Motive: {intent.motive}")
            print(f"   Business Type: {intent.business_type}")
            print(f"   Priority: {intent.priority}")
        else:
            print(f"❌ Intent extraction returned None")
            issues.append(f"MEDIUM: Intent extraction returned None for valid command")
    except Exception as e:
        print(f"❌ Intent extraction FAILED: {str(e)}")
        issues.append(f"HIGH: Intent extraction failed - {str(e)}")

    return issues

def test_package_dependencies():
    """Test 4: Check critical package dependencies"""
    print("\n=== TEST 4: Package Dependencies ===")
    issues = []

    packages = [
        "azure",
        "openai",
        "pymongo",
        "redis",
        "pydantic",
        "pytest",
    ]

    for pkg in packages:
        try:
            __import__(pkg)
            print(f"✅ {pkg}: Available")
        except ImportError:
            print(f"⚠️  {pkg}: Not available (may be optional)")
            if pkg in ["pytest"]:
                issues.append(f"MEDIUM: {pkg} not installed - needed for testing")

    return issues

def test_circular_dependencies():
    """Test 5: Check for circular import issues"""
    print("\n=== TEST 5: Circular Dependency Check ===")
    issues = []

    try:
        # Test importing everything at once
        from agents import (
            SpecAgent, DeployAgent, SecurityAgent
        )
        from infrastructure import (
            IntentExtractor, ReflectionHarness
        )
        print(f"✅ No circular dependencies detected")
    except ImportError as e:
        print(f"❌ Circular dependency or import error: {str(e)}")
        issues.append(f"CRITICAL: Circular dependency or import error - {str(e)}")

    return issues

def main():
    print("=" * 60)
    print("DEPLOYMENT TEST SUITE - Day 4 Components")
    print("=" * 60)

    all_issues = []

    # Run all tests
    all_issues.extend(test_imports())
    all_issues.extend(test_basic_initialization())
    all_issues.extend(test_intent_extraction())
    all_issues.extend(test_package_dependencies())
    all_issues.extend(test_circular_dependencies())

    # Summary
    print("\n" + "=" * 60)
    print("DEPLOYMENT TEST SUMMARY")
    print("=" * 60)

    if not all_issues:
        print("✅ ALL TESTS PASSED - Deployment Ready")
        print("Deployment Score: 100/100")
        return 0
    else:
        print(f"❌ {len(all_issues)} ISSUES FOUND")
        print("\nIssues by Severity:")

        critical = [i for i in all_issues if i.startswith("CRITICAL")]
        high = [i for i in all_issues if i.startswith("HIGH")]
        medium = [i for i in all_issues if i.startswith("MEDIUM")]
        low = [i for i in all_issues if i.startswith("LOW")]

        if critical:
            print(f"\n🔴 CRITICAL ({len(critical)}):")
            for issue in critical:
                print(f"   - {issue}")

        if high:
            print(f"\n🟠 HIGH ({len(high)}):")
            for issue in high:
                print(f"   - {issue}")

        if medium:
            print(f"\n🟡 MEDIUM ({len(medium)}):")
            for issue in medium:
                print(f"   - {issue}")

        if low:
            print(f"\n🔵 LOW ({len(low)}):")
            for issue in low:
                print(f"   - {issue}")

        # Calculate score
        score = 100 - (len(critical) * 20) - (len(high) * 10) - (len(medium) * 5) - (len(low) * 2)
        score = max(0, score)

        print(f"\nDeployment Score: {score}/100")

        if critical:
            print("\n🚨 PRODUCTION READINESS: NO (Critical issues must be fixed)")
            return 1
        elif len(high) > 2:
            print("\n⚠️  PRODUCTION READINESS: NO (Too many high-priority issues)")
            return 1
        else:
            print("\n✅ PRODUCTION READINESS: YES (with minor fixes recommended)")
            return 0

if __name__ == "__main__":
    sys.exit(main())
