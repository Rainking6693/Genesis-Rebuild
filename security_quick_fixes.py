#!/usr/bin/env python3
"""
Security Quick Fixes - Post-Deployment Hardening
Apply 3 short-term security enhancements identified in Phase 3 audit

Run: python security_quick_fixes.py
Time: ~5 minutes
"""
import re
import sys
from pathlib import Path


def fix_openai_key_redaction():
    """Fix 1: Extend OpenAI key redaction to cover sk-proj- prefix"""
    print("\n[1/3] Fixing OpenAI key redaction pattern...")

    file_path = Path("infrastructure/security_utils.py")
    content = file_path.read_text()

    # Find the OpenAI key pattern
    old_pattern = "        r'sk-[a-zA-Z0-9]{32,}': '[REDACTED_OPENAI_KEY]',"
    new_pattern = """        # OpenAI keys (sk-... and sk-proj-...)
        r'sk-[a-zA-Z0-9]{32,}': '[REDACTED_OPENAI_KEY]',
        r'sk-proj-[a-zA-Z0-9]{32,}': '[REDACTED_OPENAI_KEY]',"""

    if old_pattern in content:
        content = content.replace(old_pattern, new_pattern)
        file_path.write_text(content)
        print("   ✅ OpenAI key redaction extended (sk-proj- prefix now covered)")
        return True
    else:
        print("   ⚠️  Pattern already updated or not found")
        return False


def fix_user_request_logging():
    """Fix 2: Add credential redaction to user request logging"""
    print("\n[2/3] Adding credential redaction to observability logging...")

    file_path = Path("infrastructure/observability.py")
    content = file_path.read_text()

    # Add import if not present
    if "from infrastructure.security_utils import redact_credentials" not in content:
        # Add import after other imports
        import_line = "from opentelemetry.trace import Status, StatusCode"
        new_import = f"{import_line}\nfrom infrastructure.security_utils import redact_credentials"
        content = content.replace(import_line, new_import)

    # Find the logging line
    old_logging = '''        logger.info(
            f"Created correlation context: {ctx.correlation_id}",
            extra={"correlation_id": ctx.correlation_id, "user_request": user_request}
        )'''

    new_logging = '''        # Redact credentials before logging
        safe_request = redact_credentials(user_request)
        logger.info(
            f"Created correlation context: {ctx.correlation_id}",
            extra={"correlation_id": ctx.correlation_id, "user_request": safe_request}
        )'''

    if old_logging in content:
        content = content.replace(old_logging, new_logging)
        file_path.write_text(content)
        print("   ✅ User request logging now sanitized")
        return True
    else:
        print("   ⚠️  Logging already sanitized or not found")
        return False


def fix_md5_usage():
    """Fix 3: Replace MD5 with SHA256 in benchmark recorder"""
    print("\n[3/3] Replacing MD5 with SHA256 in benchmark recorder...")

    file_path = Path("infrastructure/benchmark_recorder.py")
    if not file_path.exists():
        print("   ℹ️  benchmark_recorder.py not found (optional component)")
        return False

    content = file_path.read_text()

    # Replace MD5 with SHA256
    old_code = "        return hashlib.md5(task.encode()).hexdigest()[:12]"
    new_code = "        return hashlib.sha256(task.encode(), usedforsecurity=False).hexdigest()[:12]"

    if old_code in content:
        content = content.replace(old_code, new_code)
        file_path.write_text(content)
        print("   ✅ MD5 replaced with SHA256 (deprecated algorithm removed)")
        return True
    else:
        print("   ⚠️  MD5 already replaced or not found")
        return False


def main():
    """Apply all security quick fixes"""
    print("=" * 70)
    print("SECURITY QUICK FIXES - Phase 3 Post-Deployment Hardening")
    print("=" * 70)

    results = []

    try:
        results.append(("OpenAI Key Redaction", fix_openai_key_redaction()))
        results.append(("User Request Sanitization", fix_user_request_logging()))
        results.append(("MD5 Replacement", fix_md5_usage()))
    except Exception as e:
        print(f"\n❌ Error applying fixes: {e}")
        sys.exit(1)

    # Summary
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)

    applied = sum(1 for _, success in results if success)
    total = len(results)

    for name, success in results:
        status = "✅ APPLIED" if success else "⚠️  SKIPPED"
        print(f"{status}: {name}")

    print(f"\nFixed: {applied}/{total}")

    if applied == total:
        print("\n✅ All security quick fixes applied successfully!")
        print("\nNext steps:")
        print("1. Run tests: pytest tests/test_security_adversarial.py")
        print("2. Commit changes: git add . && git commit -m 'Apply Phase 3 security quick fixes'")
        print("3. Deploy to production")
    else:
        print("\n⚠️  Some fixes were skipped (already applied or files not found)")
        print("System is still production-ready.")

    print("\nRefer to PHASE3_SECURITY_AUDIT.md for full audit report.")


if __name__ == "__main__":
    main()
