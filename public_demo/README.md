# Public Demo Page

**Purpose:** External stakeholder visibility and transparent research trace publishing  
**Status:** ✅ Basic structure complete  
**Timeline:** 1 week (optional, 8 hours)

---

## Overview

The public demo page provides a transparent view of Genesis research progress for external stakeholders. It displays sanitized metrics, current initiatives, and research highlights.

---

## Files

- `index.html` - Main demo page (HTML + JavaScript)
- `data/public_demo_payload.json` - Research trace data (auto-generated)
- `scripts/publish_trace.py` - Research trace publisher script
- `README.md` - This file

---

## Usage

### Generate Research Trace

```bash
cd public_demo
python3 scripts/publish_trace.py
```

This updates `data/public_demo_payload.json` with current system metrics.

### View Demo Page

```bash
# Local development
cd public_demo
python3 -m http.server 8000
# Open http://localhost:8000 in browser
```

### Deploy to Public URL

**Option 1: GitHub Pages**
```bash
# Push public_demo/ directory to gh-pages branch
git subtree push --prefix public_demo origin gh-pages
```

**Option 2: Static Hosting**
- Deploy `public_demo/` directory to Vercel, Netlify, or similar
- Set up automatic updates via GitHub Actions

---

## Data Structure

The `public_demo_payload.json` contains:

```json
{
  "generated_at": "2025-10-31 15:00 UTC",
  "metrics": {
    "system_health": "8.5/10",
    "active_agents": "15/15",
    "success_rate": "99.1%",
    "weekly_cost": "$40-60"
  },
  "initiatives": {
    "discorl": { ... },
    "public_demo": { ... },
    "orra": { ... }
  },
  "highlights": [ ... ]
}
```

---

## Automation

### Scheduled Updates

Add to cron or GitHub Actions:

```bash
# Daily update at 9 AM UTC
0 9 * * * cd /path/to/genesis-rebuild/public_demo && python3 scripts/publish_trace.py
```

### GitHub Actions Example

```yaml
name: Update Public Demo
on:
  schedule:
    - cron: '0 9 * * *'  # Daily at 9 AM UTC
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Update demo data
        run: |
          cd public_demo
          python3 scripts/publish_trace.py
      - name: Commit and push
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add public_demo/data/public_demo_payload.json
          git commit -m "Update public demo data" || exit 0
          git push
```

---

## Security

**Important:** The publisher script sanitizes data to remove:
- API keys
- Tokens
- Secrets
- Internal IPs
- Credentials

Always review `public_demo_payload.json` before deploying to ensure no sensitive data.

---

## Customization

Edit `index.html` to customize:
- Colors and styling
- Additional metrics
- Layout and sections
- Branding

---

**Status:** ✅ Basic structure complete  
**Next:** Deploy to public URL when ready

