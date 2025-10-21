# Testing Quick Reference Card

**MANDATORY FOR ALL UI/DASHBOARD TESTING**
**Effective:** October 21, 2025

---

## ⚠️ The Grafana Incident

**What Happened:** Forge claimed "Production-Ready ✅" but dashboard showed NO DATA
**Why:** Tested infrastructure exists, NOT that it works
**Fix Required:** Emergency patch by Claude session

---

## ✅ The Three-Layer Pyramid

### Layer 1: Infrastructure ⚠️ NOT ENOUGH
```bash
curl http://localhost:9090/-/healthy  # Service up?
```

### Layer 2: Functional ✅ REQUIRED
```bash
curl 'http://localhost:9090/api/v1/query?query=genesis_tests_total'
# Must return actual data, not empty []
```

### Layer 3: Visual ✅✅ MANDATORY
```bash
# 1. Open browser: http://localhost:3000
# 2. Take screenshot
# 3. Verify NO "No Data" messages
# 4. Save to docs/validation/YYYYMMDD_component/
```

---

## 🚫 NEVER Claim "Production-Ready ✅" Without

1. ✅ Infrastructure tests passing
2. ✅ Functional tests passing  
3. ✅ Screenshots showing working UI
4. ✅ E2E validation script

---

## 📋 Pre-Delivery Checklist

- [ ] pytest passing
- [ ] Queries return real data
- [ ] Screenshot taken
- [ ] NO error messages in screenshot
- [ ] Screenshot saved to docs/validation/
- [ ] Screenshot link in report

---

## 📸 How to Take Screenshots

### Manual
```bash
# macOS: Cmd+Shift+4
# Linux: gnome-screenshot
# Windows: Win+Shift+S
```

### Automated
```python
# Playwright
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto('http://localhost:3000')
    page.screenshot(path='dashboard.png')
```

---

## ❓ The Three Questions

1. **Does it exist?** (Infrastructure)
2. **Does it work?** (Functional)
3. **Can users see it?** (Visual)

**All three = YES? → Production-Ready ✅**
**Any NO? → NOT ready ❌**

---

**Full Details:** `/home/genesis/genesis-rebuild/docs/TESTING_STANDARDS.md`
