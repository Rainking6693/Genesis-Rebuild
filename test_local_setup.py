#!/usr/bin/env python3
"""
Quick test script to verify Genesis-Rebuild local setup on Windows
Run this after installing dependencies to check everything is working
"""

import sys
import os
from pathlib import Path

def check_python_version():
    """Check if Python version is 3.10+"""
    version = sys.version_info
    print(f"🐍 Python Version: {version.major}.{version.minor}.{version.micro}")

    if version.major >= 3 and version.minor >= 10:
        print("   ✅ Python version OK (3.10+)")
        return True
    else:
        print("   ❌ Python version too old (need 3.10+)")
        return False

def check_dependencies():
    """Check if key dependencies are installed"""
    required = [
        ('anthropic', 'Anthropic Claude SDK'),
        ('openai', 'OpenAI SDK'),
        ('pydantic', 'Pydantic validation'),
        ('aiohttp', 'Async HTTP'),
        ('dotenv', 'Environment variables'),
    ]

    optional = [
        ('pymongo', 'MongoDB support'),
        ('playwright', 'Browser automation'),
        ('google.cloud.aiplatform', 'Google Vertex AI'),
    ]

    print("\n📦 Required Dependencies:")
    all_ok = True
    for module, name in required:
        try:
            __import__(module)
            print(f"   ✅ {name}")
        except ImportError:
            print(f"   ❌ {name} - MISSING (install with: pip install {module})")
            all_ok = False

    print("\n📦 Optional Dependencies:")
    for module, name in optional:
        try:
            __import__(module)
            print(f"   ✅ {name}")
        except ImportError:
            print(f"   ⚠️  {name} - not installed (optional)")

    return all_ok

def check_environment():
    """Check if .env file exists and has API keys"""
    print("\n🔑 Environment Configuration:")

    # Try to load .env
    try:
        from dotenv import load_dotenv
        load_dotenv()
        print("   ✅ .env file loading works")
    except Exception as e:
        print(f"   ❌ Error loading .env: {e}")
        return False

    # Check for .env file
    env_path = Path('.env')
    if not env_path.exists():
        print("   ⚠️  .env file not found - create one with API keys")
        return False
    else:
        print("   ✅ .env file exists")

    # Check API keys
    api_keys = {
        'ANTHROPIC_API_KEY': 'Anthropic Claude',
        'OPENAI_API_KEY': 'OpenAI GPT',
        'GEMINI_API_KEY': 'Google Gemini',
    }

    found_key = False
    for key, name in api_keys.items():
        value = os.getenv(key)
        if value:
            # Show first/last 4 chars only
            masked = f"{value[:7]}...{value[-4:]}" if len(value) > 15 else "***"
            print(f"   ✅ {name}: {masked}")
            found_key = True
        else:
            print(f"   ⚠️  {name}: not set")

    if not found_key:
        print("\n   ❌ No API keys found! Add at least one to .env")
        return False

    return True

def check_project_structure():
    """Check if key project directories exist"""
    print("\n📁 Project Structure:")

    required_dirs = [
        'infrastructure',
        'agents',
        'config',
    ]

    all_ok = True
    for dir_name in required_dirs:
        dir_path = Path(dir_name)
        if dir_path.exists() and dir_path.is_dir():
            print(f"   ✅ {dir_name}/ exists")
        else:
            print(f"   ❌ {dir_name}/ missing")
            all_ok = False

    return all_ok

def test_anthropic_connection():
    """Test Anthropic API connection"""
    print("\n🔌 Testing Anthropic API Connection:")

    try:
        from anthropic import Anthropic
        import os

        api_key = os.getenv('ANTHROPIC_API_KEY')
        if not api_key:
            print("   ⚠️  ANTHROPIC_API_KEY not set - skipping test")
            return True

        client = Anthropic(api_key=api_key)

        # Make a minimal test call
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=10,
            messages=[{"role": "user", "content": "Hi"}]
        )

        print("   ✅ Anthropic API connection works!")
        print(f"   ✅ Response: {response.content[0].text}")
        return True

    except Exception as e:
        print(f"   ❌ Anthropic API test failed: {e}")
        return False

def main():
    """Run all checks"""
    print("=" * 60)
    print("🚀 Genesis-Rebuild Local Setup Test")
    print("=" * 60)

    results = {
        'Python Version': check_python_version(),
        'Dependencies': check_dependencies(),
        'Environment': check_environment(),
        'Project Structure': check_project_structure(),
    }

    # Optional: Test API connection if dependencies OK
    if results['Dependencies'] and results['Environment']:
        results['API Connection'] = test_anthropic_connection()

    # Summary
    print("\n" + "=" * 60)
    print("📊 Summary:")
    print("=" * 60)

    all_passed = True
    for check, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"   {status} - {check}")
        if not passed:
            all_passed = False

    print("\n" + "=" * 60)
    if all_passed:
        print("✅ All checks passed! You're ready to run Genesis locally.")
        print("\nNext steps:")
        print("   1. Run: python scripts/autonomous_fully_integrated.py")
        print("   2. Or see: LOCAL_SETUP_WINDOWS.md for more options")
    else:
        print("⚠️  Some checks failed. Please fix the issues above.")
        print("\nSee LOCAL_SETUP_WINDOWS.md for detailed setup instructions.")
    print("=" * 60)

    return 0 if all_passed else 1

if __name__ == '__main__':
    sys.exit(main())
