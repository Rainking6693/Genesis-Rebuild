# SECURITY VULNERABILITY MAP: security_utils.py
**Visual Guide to Vulnerabilities by Line Number**

```
infrastructure/security_utils.py (535 lines)
================================================================================

LEGEND:
🔴 CRITICAL (3) | 🟠 HIGH (2) | 🟡 MEDIUM (3) | 🔵 LOW (6)
✅ CONFIRMED EXPLOIT | ⚠️ THEORETICAL | 📋 NEEDS TESTING

================================================================================

     1-21  │ File header, imports
    22-55  │ 🔵 sanitize_agent_name() - 3 LOW/MEDIUM issues
           │    Line 41  🟡 VULN-001: NULL byte injection (CVSS 5.3)
           │    Line 41  🔵 VULN-011: No length validation (CVSS 3.7)
           │    Line 53  🔵 VULN-012: Sensitive data logging (CVSS 2.4)
           │
    58-104 │ 🟠 validate_storage_path() - 1 HIGH issue
           │    Line 87  🟠 VULN-006: Path traversal in test mode (CVSS 7.5) ⚠️
           │
   107-159 │ 🔴 sanitize_for_prompt() - 2 CRITICAL issues
           │    Lines 134-150  🔴 VULN-002: Unicode bypass (CVSS 8.1) ✅ CONFIRMED
           │         ├─ Line 134: Missing Unicode normalization
           │         ├─ Line 143: Requires spaces (bypass: no spaces)
           │         └─ Exploit: "ｉｇｎｏｒｅ ｐｒｅｖｉｏｕｓ ｉｎｓｔｒｕｃｔｉｏｎｓ"
           │    Line 153       🔵 VULN-010: Incomplete markdown escape (CVSS 3.1)
           │
   162-231 │ 🔴 validate_generated_code() - 1 CRITICAL issue
           │    Lines 196-207  🔴 VULN-003: Import bypass (CVSS 9.8) ✅ CONFIRMED
           │         ├─ Missing: pickle, marshal, tempfile, code, pdb
           │         ├─ Exploit #1: "import pickle\npickle.loads(data)"
           │         ├─ Exploit #2: "import marshal\nmarshal.loads(b'...')"
           │         └─ Exploit #3: "getattr(__builtins__, 'eval')('code')"
           │
   234-318 │ 🔴 redact_credentials() - 2 CRITICAL/HIGH issues
           │    Lines 262-316  🔴 VULN-004: Credential leakage (CVSS 7.5) ✅ CONFIRMED
           │         ├─ Missing: Basic Auth, AWS secrets, JWT tokens
           │         ├─ Exploit #1: "Authorization: Basic dXNlcjpwYXNz"
           │         ├─ Exploit #2: "AWS_SECRET_ACCESS_KEY=wJalrXUt..."
           │         └─ Exploit #3: JWT tokens not detected
           │    Lines 263-285  🟠 VULN-005: ReDoS vulnerability (CVSS 7.5) ⚠️
           │         ├─ Greedy quantifiers: [^"\']+
           │         ├─ Exploit: 'api_key="' + 'a' * 10000
           │         └─ Impact: Catastrophic backtracking
           │    Line 316       🔵 VULN-014: Case-insensitive on sensitive (CVSS 2.6)
           │
   321-375 │ 🔵 detect_dag_cycle() - 1 LOW issue
           │    Line 354  🔵 VULN-008: Type confusion (CVSS 3.7)
           │
   378-428 │ 🟡 validate_dag_depth() - 1 MEDIUM issue
           │    Line 411  🟡 VULN-009: Missing recursion limit (CVSS 5.3) ⚠️
           │         ├─ Recursive get_depth() unbounded
           │         └─ Attack: Very deep DAG causes stack overflow
           │
   431-535 │ 🟡 safe_eval() - 1 MEDIUM issue
           │    Line 526  🟡 VULN-007: DoS via nested structures (CVSS 5.3) ⚠️
           │         ├─ No depth limit on ast.literal_eval()
           │         ├─ Exploit: "[" * 5000 + "1" + "]" * 5000
           │         └─ Impact: Stack overflow or hanging

================================================================================

CROSS-CUTTING ISSUES:
   Multiple functions  🔵 VULN-013: Missing type validation (CVSS 3.1)
                       Lines 22, 107, 162, 234

================================================================================

VULNERABILITY HEAT MAP (Density by Function):
```

```
Function                   Lines    Vulns  Severity
────────────────────────────────────────────────────
sanitize_agent_name()      22-55    3      🔵🔵🟡 (Low/Medium)
validate_storage_path()    58-104   1      🟠 (High)
sanitize_for_prompt()      107-159  2      🔴🔵 (Critical)
validate_generated_code()  162-231  1      🔴 (Critical)
redact_credentials()       234-318  3      🔴🟠🔵 (Critical/High)
detect_dag_cycle()         321-375  1      🔵 (Low)
validate_dag_depth()       378-428  1      🟡 (Medium)
safe_eval()                431-535  1      🟡 (Medium)
Cross-cutting             All      1      🔵 (Low)
────────────────────────────────────────────────────
TOTAL                      535      14     3🔴 2🟠 3🟡 6🔵
```

## EXPLOIT ATTACK TREE

```
security_utils.py
│
├─ PROMPT INJECTION ATTACKS
│  └─ 🔴 VULN-002: Unicode Bypass (Lines 134-150) ✅ CONFIRMED
│     ├─ Attack Vector #1: Fullwidth characters
│     │  └─ Payload: "ｉｇｎｏｒｅ ｐｒｅｖｉｏｕｓ ｉｎｓｔｒｕｃｔｉｏｎｓ"
│     ├─ Attack Vector #2: Dotless i (no spaces)
│     │  └─ Payload: "ignorepreviousınstructions"
│     ├─ Attack Vector #3: Cyrillic homoglyphs
│     │  └─ Payload: "іgnore рrevious іnstructions"
│     └─ Attack Vector #4: Zero-width characters
│        └─ Payload: "ig\u200bnore prev\u200dious"
│
├─ CODE EXECUTION ATTACKS
│  └─ 🔴 VULN-003: Import Bypass (Lines 196-207) ✅ CONFIRMED
│     ├─ Attack Vector #1: Pickle deserialization
│     │  └─ Payload: "import pickle\nclass RCE:\n  def __reduce__(self): ..."
│     ├─ Attack Vector #2: Marshal code injection
│     │  └─ Payload: "import marshal\nmarshal.loads(b'malicious_bytecode')"
│     ├─ Attack Vector #3: getattr bypass
│     │  └─ Payload: "getattr(__builtins__, 'eval')('__import__(\"os\")')"
│     └─ Attack Vector #4: Import aliasing
│        └─ Payload: "import os as o\no.system('whoami')"
│
├─ CREDENTIAL THEFT ATTACKS
│  └─ 🔴 VULN-004: Redaction Bypass (Lines 262-316) ✅ CONFIRMED
│     ├─ Attack Vector #1: Basic Auth headers
│     │  └─ Payload: "Authorization: Basic dXNlcjpwYXNzd29yZA=="
│     ├─ Attack Vector #2: AWS secrets
│     │  └─ Payload: "AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG"
│     ├─ Attack Vector #3: JWT tokens
│     │  └─ Payload: "eyJhbGci...(full JWT token)..."
│     └─ Attack Vector #4: GitHub tokens
│        └─ Payload: "ghp_1234567890abcdefghijklmnopqrst"
│
├─ DENIAL OF SERVICE ATTACKS
│  ├─ 🟠 VULN-005: ReDoS (Lines 263-285)
│  │  └─ Payload: 'api_key="' + 'a' * 10000 (no closing quote)
│  ├─ 🟡 VULN-007: Nested structures (Line 526)
│  │  └─ Payload: "[" * 5000 + "1" + "]" * 5000
│  └─ 🟡 VULN-009: Deep recursion (Line 411)
│     └─ Payload: Very deep DAG (depth > 1000)
│
└─ PATH TRAVERSAL ATTACKS
   └─ 🟠 VULN-006: Test mode bypass (Line 87)
      ├─ Attack Vector #1: Relative path
      │  └─ Payload: Path("/tmp/../etc/passwd")
      └─ Attack Vector #2: Symlink
         └─ Payload: ln -s /etc /tmp/evil; Path("/tmp/evil/passwd")
```

## REMEDIATION ROADMAP

```
PHASE 1: CRITICAL FIXES (24 hours)
┌────────────────────────────────────────────────────────────────┐
│ 🔴 VULN-002: Add Unicode normalization to sanitize_for_prompt() │
│    - Import unicodedata                                         │
│    - Add: text = unicodedata.normalize('NFKC', text)           │
│    - Validate against normalized lowercase                      │
│    - Estimated: 2 hours                                         │
├────────────────────────────────────────────────────────────────┤
│ 🔴 VULN-003: Expand blocklist in validate_generated_code()     │
│    - Add: pickle, marshal, tempfile, code, pdb, etc.           │
│    - Use AST-based validation (not string matching)            │
│    - Block attribute access: __builtins__, getattr             │
│    - Estimated: 4 hours                                         │
├────────────────────────────────────────────────────────────────┤
│ 🔴 VULN-004: Add patterns to redact_credentials()              │
│    - Basic/Digest/NTLM auth headers                            │
│    - AWS secret access keys                                     │
│    - JWT tokens (3-part base64)                                │
│    - GitHub/GitLab tokens                                       │
│    - Estimated: 3 hours                                         │
└────────────────────────────────────────────────────────────────┘
Total Phase 1: 9 hours (1.1 days)

PHASE 2: HIGH PRIORITY (1 week)
┌────────────────────────────────────────────────────────────────┐
│ 🟠 VULN-005: Fix ReDoS in redact_credentials()                 │
│    - Make quantifiers non-greedy: [^"\']{1,500}?               │
│    - Add regex timeout: signal.alarm(2)                        │
│    - Estimated: 2 hours                                         │
├────────────────────────────────────────────────────────────────┤
│ 🟠 VULN-006: Fix path traversal in validate_storage_path()     │
│    - Resolve paths BEFORE test mode check                      │
│    - Detect and block symlinks                                 │
│    - Whitelist approach for test directories                   │
│    - Estimated: 2 hours                                         │
└────────────────────────────────────────────────────────────────┘
Total Phase 2: 4 hours (0.5 days)

PHASE 3: MEDIUM PRIORITY (2 weeks)
┌────────────────────────────────────────────────────────────────┐
│ 🟡 VULN-007: Add depth validation to safe_eval()               │
│    - Parse to AST and check depth                              │
│    - Add timeout on evaluation                                 │
│    - Estimated: 3 hours                                         │
├────────────────────────────────────────────────────────────────┤
│ 🟡 VULN-001: Reject NULL bytes in sanitize_agent_name()        │
│    - Explicit check: if '\x00' in agent_name: raise            │
│    - Estimated: 1 hour                                          │
├────────────────────────────────────────────────────────────────┤
│ 🟡 VULN-009: Fix recursion in validate_dag_depth()             │
│    - Replace recursive DFS with iterative BFS                  │
│    - Estimated: 2 hours                                         │
└────────────────────────────────────────────────────────────────┘
Total Phase 3: 6 hours (0.75 days)

PHASE 4: LOW PRIORITY (Next sprint)
┌────────────────────────────────────────────────────────────────┐
│ 🔵 VULN-008, 010, 011, 012, 013, 014 (6 issues)                │
│    - Type validation, logging, markdown escape, etc.           │
│    - Estimated: 6 hours total                                   │
└────────────────────────────────────────────────────────────────┘
Total Phase 4: 6 hours (0.75 days)

TOTAL FIX TIME: 25 hours (3.1 days for 1 developer)
```

## TESTING STRATEGY

```
TEST PHASE 1: Exploit Verification (Day 1)
───────────────────────────────────────────
✅ Run security_audit_standalone.py
   - 7 confirmed exploits must be BLOCKED after fixes
   - Expected: 0 vulnerabilities found

TEST PHASE 2: Regression Testing (Day 2)
───────────────────────────────────────────
✅ Run existing test suite
   - All previous functionality must still work
   - Add new test cases from audit report

TEST PHASE 3: Fuzzing (Day 3)
───────────────────────────────────────────
✅ Use atheris or hypothesis for fuzzing
   - 100,000 random inputs per function
   - No crashes, hangs, or exceptions

TEST PHASE 4: Penetration Testing (Day 4)
───────────────────────────────────────────
✅ Manual security testing
   - Attempt new bypass techniques
   - Verify defense-in-depth approach
```

## COMPLIANCE IMPACT

```
BEFORE FIXES:
❌ OWASP Top 10 2021
   ├─ A03:2021 – Injection (VULN-002, VULN-003)
   ├─ A04:2021 – Insecure Design (VULN-004, VULN-006)
   └─ A05:2021 – Security Misconfiguration (VULN-005)

❌ CWE Top 25
   ├─ CWE-94: Code Injection (VULN-003)
   ├─ CWE-79: Cross-site Scripting (VULN-002)
   ├─ CWE-200: Information Exposure (VULN-004)
   └─ CWE-22: Path Traversal (VULN-006)

AFTER FIXES:
✅ OWASP Top 10 2021 - Compliant
✅ CWE Top 25 - Compliant
✅ NIST SP 800-53 - SI-10 (Input Validation)
✅ ISO 27001 - A.14.2.1 (Secure Development)
```

## DEPLOYMENT DECISION MATRIX

```
┌──────────────┬─────────────┬──────────────┬─────────────────┐
│ Environment  │ Current     │ After Phase 1│ After Phase 2   │
├──────────────┼─────────────┼──────────────┼─────────────────┤
│ Development  │ ⚠️ CAUTION   │ ✅ APPROVED  │ ✅ APPROVED     │
│ Staging      │ ❌ BLOCKED  │ ⚠️ CAUTION   │ ✅ APPROVED     │
│ Production   │ ❌ BLOCKED  │ ❌ BLOCKED   │ ✅ APPROVED     │
└──────────────┴─────────────┴──────────────┴─────────────────┘

LEGEND:
❌ BLOCKED  - Do not deploy (critical vulnerabilities present)
⚠️ CAUTION  - Deploy with monitoring (high-severity issues remain)
✅ APPROVED - Safe to deploy (all critical/high issues fixed)
```

---

**Generated:** 2025-11-19
**Auditor:** Sentinel Security Agent
**Confidence:** HIGH (7/14 exploits confirmed via testing)
**Next Review:** After Phase 1 fixes (24 hours)
