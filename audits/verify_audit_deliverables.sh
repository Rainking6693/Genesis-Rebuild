#!/bin/bash
# SE-Darwin Memory Integration Audit - Deliverables Verification Script
# Verifies all audit files are present and properly structured

echo "╔═══════════════════════════════════════════════════════════════════════╗"
echo "║         SE-Darwin Memory Integration Audit - Verification            ║"
echo "╚═══════════════════════════════════════════════════════════════════════╝"
echo ""

AUDIT_DIR="/home/genesis/genesis-rebuild/audits"
PASS=0
FAIL=0

# Function to check file exists and has minimum size
check_file() {
    local file=$1
    local min_size=$2
    local description=$3

    if [ -f "$file" ]; then
        local size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        if [ "$size" -ge "$min_size" ]; then
            echo "✓ PASS: $description"
            echo "  File: $file"
            echo "  Size: $(du -h "$file" | cut -f1)"
            ((PASS++))
        else
            echo "✗ FAIL: $description (file too small: $size bytes < $min_size bytes)"
            ((FAIL++))
        fi
    else
        echo "✗ FAIL: $description (file not found)"
        ((FAIL++))
    fi
    echo ""
}

# Function to check Python file syntax
check_python_syntax() {
    local file=$1
    local description=$2

    if python3 -m py_compile "$file" 2>/dev/null; then
        echo "✓ PASS: $description - Python syntax valid"
        ((PASS++))
    else
        echo "✗ FAIL: $description - Python syntax errors"
        ((FAIL++))
    fi
    echo ""
}

echo "═══════════════════════════════════════════════════════════════════════"
echo "CHECKING REQUIRED FILES"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""

# Check audit report
check_file "$AUDIT_DIR/tier1_se_darwin_audit.md" 20000 "Comprehensive Audit Report"

# Check fixes file
check_file "$AUDIT_DIR/tier1_se_darwin_fixes.py" 15000 "Critical Fixes Implementation"

# Check test files
check_file "$AUDIT_DIR/test_se_darwin_memory_focused.py" 8000 "Focused Test Suite"
check_file "$AUDIT_DIR/test_se_darwin_memory.py" 10000 "Comprehensive Test Suite"

# Check README
check_file "$AUDIT_DIR/README_SE_DARWIN_AUDIT.md" 5000 "Audit README Documentation"

echo "═══════════════════════════════════════════════════════════════════════"
echo "CHECKING PYTHON SYNTAX"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""

check_python_syntax "$AUDIT_DIR/tier1_se_darwin_fixes.py" "Fixes File Syntax"
check_python_syntax "$AUDIT_DIR/test_se_darwin_memory_focused.py" "Focused Tests Syntax"

echo "═══════════════════════════════════════════════════════════════════════"
echo "CHECKING AUDIT CONTENT"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""

# Check for key sections in audit report
if grep -q "Executive Summary" "$AUDIT_DIR/tier1_se_darwin_audit.md" 2>/dev/null; then
    echo "✓ PASS: Audit report contains Executive Summary"
    ((PASS++))
else
    echo "✗ FAIL: Audit report missing Executive Summary"
    ((FAIL++))
fi
echo ""

if grep -q "Critical Issues" "$AUDIT_DIR/tier1_se_darwin_audit.md" 2>/dev/null; then
    echo "✓ PASS: Audit report contains Critical Issues section"
    ((PASS++))
else
    echo "✗ FAIL: Audit report missing Critical Issues section"
    ((FAIL++))
fi
echo ""

if grep -q "CONDITIONAL APPROVAL" "$AUDIT_DIR/tier1_se_darwin_audit.md" 2>/dev/null; then
    echo "✓ PASS: Audit report contains Approval Status"
    ((PASS++))
else
    echo "✗ FAIL: Audit report missing Approval Status"
    ((FAIL++))
fi
echo ""

# Check for fixes in fixes file
if grep -q "threading.Lock" "$AUDIT_DIR/tier1_se_darwin_fixes.py" 2>/dev/null; then
    echo "✓ PASS: Fixes file contains thread safety fix"
    ((PASS++))
else
    echo "✗ FAIL: Fixes file missing thread safety fix"
    ((FAIL++))
fi
echo ""

if grep -q "max_cache_size" "$AUDIT_DIR/tier1_se_darwin_fixes.py" 2>/dev/null; then
    echo "✓ PASS: Fixes file contains cache size limit fix"
    ((PASS++))
else
    echo "✗ FAIL: Fixes file missing cache size limit fix"
    ((FAIL++))
fi
echo ""

if grep -q "fitness_before" "$AUDIT_DIR/tier1_se_darwin_fixes.py" 2>/dev/null; then
    echo "✓ PASS: Fixes file contains fitness_before fix"
    ((PASS++))
else
    echo "✗ FAIL: Fixes file missing fitness_before fix"
    ((FAIL++))
fi
echo ""

echo "═══════════════════════════════════════════════════════════════════════"
echo "VERIFICATION SUMMARY"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""
echo "Total Checks: $((PASS + FAIL))"
echo "Passed: $PASS"
echo "Failed: $FAIL"
echo ""

if [ $FAIL -eq 0 ]; then
    echo "✓✓✓ ALL VERIFICATION CHECKS PASSED ✓✓✓"
    echo ""
    echo "Audit deliverables are complete and ready for review."
    echo ""
    echo "Next steps:"
    echo "1. Review tier1_se_darwin_audit.md for detailed findings"
    echo "2. Review tier1_se_darwin_fixes.py for fix implementations"
    echo "3. Run: python3 audits/test_se_darwin_memory_focused.py"
    echo "4. Apply fixes to agents/se_darwin_agent.py"
    echo "5. Re-test and validate"
    exit 0
else
    echo "⚠⚠⚠ VERIFICATION FAILED: $FAIL CHECK(S) FAILED ⚠⚠⚠"
    echo ""
    echo "Please review the failed checks above and regenerate missing files."
    exit 1
fi
