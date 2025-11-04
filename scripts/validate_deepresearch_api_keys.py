#!/usr/bin/env python3
"""
DeepResearch API Key Validation Script

Validates that all required API keys are configured before running
the 20K example generation to avoid failures mid-generation.

Usage:
    python scripts/validate_deepresearch_api_keys.py
    python scripts/validate_deepresearch_api_keys.py --check-connectivity

Author: Cursor (Testing & Documentation Lead)
Date: November 4, 2025
"""

import os
import sys
from pathlib import Path

# Add repo root to path
ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from pipelines.deepresearch import DeepResearchConfig


def check_api_keys() -> tuple[bool, list[str]]:
    """
    Check if all required API keys are configured.
    
    Returns:
        Tuple of (all_valid, missing_keys)
    """
    config = DeepResearchConfig()
    missing = []
    
    # Check required keys
    if not config.serper_api_key:
        missing.append("SERPER_API_KEY")
    
    if not config.jina_api_key:
        missing.append("JINA_API_KEY")
    
    if not config.dashscope_api_key:
        missing.append("DASHSCOPE_API_KEY")
    
    if not config.openai_api_key:
        missing.append("OPENAI_API_KEY")
    
    # Check DeepResearch endpoint
    if not config.deepresearch_api_base:
        missing.append("DEEPRESEARCH_API_BASE")
    
    if not config.deepresearch_model:
        missing.append("DEEPRESEARCH_MODEL")
    
    return len(missing) == 0, missing


def check_connectivity() -> tuple[bool, str]:
    """
    Test connectivity to DeepResearch API endpoint.
    
    Returns:
        Tuple of (success, message)
    """
    try:
        import requests
        from pipelines.deepresearch import DeepResearchConfig
        
        config = DeepResearchConfig()
        
        if not config.has_external_provider:
            return False, "External provider not configured (missing API keys)"
        
        # Simple health check (HEAD request to base URL)
        url = config.deepresearch_api_base.rstrip('/')
        response = requests.head(url, timeout=5)
        
        if response.status_code < 500:
            return True, f"Connectivity OK (status: {response.status_code})"
        else:
            return False, f"Server error (status: {response.status_code})"
            
    except requests.RequestException as e:
        return False, f"Connection failed: {e}"
    except Exception as e:
        return False, f"Unexpected error: {e}"


def print_status(all_valid: bool, missing: list[str]):
    """Print validation status to console"""
    
    print("\n" + "="*80)
    print("DEEPRESEARCH API KEY VALIDATION")
    print("="*80 + "\n")
    
    if all_valid:
        print("✅ ALL API KEYS CONFIGURED")
        print("\nConfigured keys:")
        print("  ✅ SERPER_API_KEY")
        print("  ✅ JINA_API_KEY")
        print("  ✅ DASHSCOPE_API_KEY")
        print("  ✅ OPENAI_API_KEY")
        print("  ✅ DEEPRESEARCH_API_BASE")
        print("  ✅ DEEPRESEARCH_MODEL")
        print("\n✅ READY FOR 20K GENERATION")
    else:
        print("❌ MISSING API KEYS")
        print("\nMissing keys:")
        for key in missing:
            print(f"  ❌ {key}")
        
        print("\n📋 SETUP INSTRUCTIONS:")
        print("\n1. Export environment variables:")
        print("   export SERPER_API_KEY=your_serper_key")
        print("   export JINA_API_KEY=your_jina_key")
        print("   export DASHSCOPE_API_KEY=your_dashscope_key")
        print("   export OPENAI_API_KEY=your_openai_key")
        print("   export DEEPRESEARCH_API_BASE=https://openrouter.ai/api")
        print("   export DEEPRESEARCH_MODEL=openrouter/alibaba/tongyi-deepresearch-30b")
        
        print("\n2. Or add to .env file:")
        print("   echo 'SERPER_API_KEY=your_key' >> .env")
        print("   echo 'JINA_API_KEY=your_key' >> .env")
        print("   echo 'DASHSCOPE_API_KEY=your_key' >> .env")
        print("   echo 'OPENAI_API_KEY=your_key' >> .env")
        print("   echo 'DEEPRESEARCH_API_BASE=https://openrouter.ai/api' >> .env")
        print("   echo 'DEEPRESEARCH_MODEL=openrouter/alibaba/tongyi-deepresearch-30b' >> .env")
        
        print("\n3. Re-run this script to validate")
        
        print("\n⚠️  NOT READY - Configure API keys before generation")
    
    print("\n" + "="*80 + "\n")


def main():
    """Main entry point"""
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Validate DeepResearch API keys",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
    # Check if API keys are configured
    python scripts/validate_deepresearch_api_keys.py
    
    # Check API keys + test connectivity
    python scripts/validate_deepresearch_api_keys.py --check-connectivity
        """
    )
    
    parser.add_argument(
        "--check-connectivity",
        action="store_true",
        help="Test connectivity to DeepResearch API endpoint"
    )
    
    args = parser.parse_args()
    
    # Check API keys
    all_valid, missing = check_api_keys()
    print_status(all_valid, missing)
    
    # Check connectivity if requested
    if args.check_connectivity:
        if not all_valid:
            print("⚠️  Skipping connectivity check (API keys not configured)")
            sys.exit(1)
        
        print("🔍 Testing connectivity to DeepResearch API...")
        success, message = check_connectivity()
        
        if success:
            print(f"✅ {message}")
        else:
            print(f"❌ {message}")
            print("\n💡 TIP: Check your DEEPRESEARCH_API_BASE URL")
            print("   Example: https://openrouter.ai/api")
            sys.exit(1)
    
    # Exit code: 0 if valid, 1 if missing keys
    sys.exit(0 if all_valid else 1)


if __name__ == "__main__":
    main()

