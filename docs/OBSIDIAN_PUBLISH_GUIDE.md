---
title: Obsidian Publish Guide - Genesis Knowledge Base
category: Guides
tags: [documentation, obsidian, publishing, knowledge-base]
---

# Obsidian Publish Guide - Genesis Knowledge Base

This guide explains the Obsidian documentation export system for Genesis, enabling automated publication of project documentation as a searchable knowledge base.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Quick Start](#quick-start)
4. [Export Workflow](#export-workflow)
5. [GitHub Actions Automation](#github-actions-automation)
6. [Manual Export](#manual-export)
7. [Deployment Options](#deployment-options)
8. [Customization](#customization)
9. [Troubleshooting](#troubleshooting)
10. [Advanced Topics](#advanced-topics)

---

## Overview

### What is Obsidian Publish?

Obsidian Publish is a hosted service for publishing Obsidian vaults to the web. The Genesis export system automates the transformation of project documentation into an Obsidian-compatible vault structure suitable for:

- **Obsidian Publish** (official hosted service)
- **Obsidian Digital Garden** (free GitHub + Vercel)
- **GitHub Pages** (static site hosting)
- **Custom deployment** (self-hosted)

### Why Obsidian for Genesis?

1. **Graph-based knowledge**: Visualize documentation relationships
2. **Bidirectional linking**: Automatic backlinks between documents
3. **Tag-based organization**: Multiple categorization dimensions
4. **Search**: Full-text search across all documents
5. **Mobile-friendly**: Responsive design for all devices
6. **Version control**: Git-based workflow

### Current Statistics

- **Total Documents**: 383 markdown files
- **Categories**: 7 (Architecture, Research, Guides, Reports, Testing, Planning, Core)
- **Knowledge Graph**: 376 nodes, 6,300+ edges
- **Images**: Automatic copying to `_attachments/`

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                   Genesis Documentation                      │
│  (docs/, *.md, images, reports, guides, architecture)       │
└───────────────────┬─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│              ObsidianExporter (600 lines)                    │
│  • Scan all .md files (401 found)                           │
│  • Categorize (Architecture, Research, Guides, etc.)        │
│  • Transform links (relative → wikilinks)                   │
│  • Extract/standardize frontmatter                          │
│  • Copy images to _attachments/                             │
│  • Generate category directories                            │
└───────────────────┬─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│          KnowledgeGraphGenerator (400 lines)                 │
│  • Parse all exported files                                  │
│  • Build graph (nodes = docs, edges = links)                │
│  • Calculate backlinks                                       │
│  • Generate statistics                                       │
│  • Create Maps of Content (MOCs)                            │
│  • Export graph_data.json                                   │
└───────────────────┬─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                  Obsidian Vault Structure                    │
│  obsidian_vault/                                            │
│    ├── Core/           (9 files)                            │
│    ├── Architecture/   (101 files + INDEX.md)               │
│    ├── Research/       (1 file + INDEX.md)                  │
│    ├── Guides/         (13 files + INDEX.md)                │
│    ├── Reports/        (244 files + INDEX.md)               │
│    ├── Testing/        (12 files + INDEX.md)                │
│    ├── Planning/       (3 files + INDEX.md)                 │
│    ├── MOCs/           (Main + Category + Tag MOCs)         │
│    ├── _attachments/   (Images, diagrams)                   │
│    ├── README.md       (Main landing page)                  │
│    ├── graph_data.json (Graph visualization data)           │
│    └── search_index.json (Search index)                     │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

```
Source Markdown File
  ↓
Parse Frontmatter + Extract Metadata
  ↓
Categorize (Architecture/Research/Guides/etc.)
  ↓
Transform Links: [text](file.md) → [[file|text]]
  ↓
Transform Images: ![alt](path/img.png) → ![alt](_attachments/img.png)
  ↓
Copy Images to _attachments/
  ↓
Add Standardized Frontmatter (dg-publish, tags, category)
  ↓
Write to Category Directory
  ↓
Build Graph Relationships
  ↓
Generate Index Pages + MOCs
```

---

## Quick Start

### Run Export (Local)

```bash
# Export all documentation to Obsidian vault
python scripts/export_docs_obsidian.py

# Generate knowledge graph and MOCs
python scripts/generate_knowledge_graph.py obsidian_vault/

# View results
ls -la obsidian_vault/
```

### Run Export (Custom Paths)

```bash
# Specify source and output directories
python scripts/export_docs_obsidian.py \
  /path/to/genesis-rebuild \
  /path/to/output-vault
```

### GitHub Actions (Automatic)

Push to `main` branch automatically triggers:

1. Documentation export
2. Knowledge graph generation
3. Deployment to GitHub Pages

See [GitHub Actions Automation](#github-actions-automation) for details.

---

## Export Workflow

### Phase 1: Scanning (ObsidianExporter)

**What it does:**
- Scans all `.md` files recursively
- Excludes: `node_modules`, `.venv`, `.git`, `__pycache__`
- Total scanned: 401 files

**Categorization Logic:**

| Path Pattern | Category | Public? |
|--------------|----------|---------|
| `/docs/*architecture*` | Architecture | ✅ |
| `/docs/*research*` | Research | ✅ |
| `/docs/*guide*` | Guides | ✅ |
| `/docs/*report*` | Reports | ✅ |
| `/tests/*` | Testing | ✅ |
| `PROJECT_STATUS.md` | Core | ✅ |
| `/.claude/agents/*` | Internal | ❌ |

**File Parsing:**

```python
# Extracts frontmatter
---
title: System Architecture
tags: [architecture, design]
category: Architecture
---

# Extracts title (from frontmatter or H1)
# Extracts links: [[wikilink]] and [text](file.md)
# Extracts tags: #tag1 #tag2
```

### Phase 2: Transformation

**Link Transformation:**

```markdown
# Before
See [Architecture](../docs/ARCHITECTURE.md) for details.

# After
See [[ARCHITECTURE|Architecture]] for details.
```

**Image Transformation:**

```markdown
# Before
![Diagram](./diagrams/arch.png)

# After
![Diagram](_attachments/arch_a1b2c3d4.png)
```

**Frontmatter Standardization:**

```yaml
# Added automatically
---
title: System Architecture
category: Architecture
dg-publish: true
publish: true
tags: [architecture, design]
source: docs/ARCHITECTURE.md
exported: 2025-10-24T22:05:26.000Z
---
```

### Phase 3: Export

**Output Structure:**

```
obsidian_vault/
├── Core/
│   ├── PROJECT_STATUS.md
│   ├── CLAUDE.md
│   ├── README.md
│   └── INDEX.md (auto-generated)
├── Architecture/
│   ├── HTDAG_IMPLEMENTATION_GUIDE.md
│   ├── ORCHESTRATION_DESIGN.md
│   └── INDEX.md (auto-generated, 101 files)
├── _attachments/
│   └── arch_a1b2c3d4.png (images copied here)
```

### Phase 4: Knowledge Graph Generation

**Graph Building:**

1. Parse all exported files
2. Extract links → build edges
3. Calculate backlinks (who links to this?)
4. Identify hub nodes (most connected)
5. Generate statistics

**Output:**

- `graph_data.json` (376 nodes, 6,300 edges)
- `MOC_Main.md` (master index)
- Category MOCs: `*/MOC.md`
- Tag MOCs: `MOCs/MOC_Tag_*.md` (top 20 tags)

---

## GitHub Actions Automation

### Workflow File

Location: `.github/workflows/publish_docs.yml`

### Triggers

```yaml
on:
  push:
    branches: [main]
    paths:
      - 'docs/**'
      - '*.md'
      - 'scripts/export_docs_obsidian.py'
  workflow_dispatch:  # Manual trigger
```

### Workflow Steps

1. **Checkout repository**
2. **Set up Python 3.12**
3. **Install dependencies** (pyyaml, networkx)
4. **Export documentation** → `obsidian_vault/`
5. **Generate knowledge graph** → `graph_data.json`
6. **Create README** (vault landing page)
7. **Generate sitemap** (SEO)
8. **Create search index** (JSON)
9. **Upload artifact** (30-day retention)
10. **Deploy to GitHub Pages** (automatic)
11. **Validation** (check structure, broken links)

### Manual Trigger

```bash
# Via GitHub UI
Actions → Publish Documentation → Run workflow

# Via gh CLI
gh workflow run publish_docs.yml \
  --field deploy_target=github-pages
```

### Deployment Targets

- `github-pages`: Deploy to GitHub Pages (default)
- `obsidian-publish`: Manual Obsidian Publish upload
- `both`: GitHub Pages + artifact for Obsidian

---

## Manual Export

### Local Development

```bash
# 1. Export documentation
cd /home/genesis/genesis-rebuild
python scripts/export_docs_obsidian.py

# 2. Generate knowledge graph
python scripts/generate_knowledge_graph.py obsidian_vault/

# 3. Inspect results
ls -la obsidian_vault/
cat obsidian_vault/README.md
```

### Open in Obsidian (Desktop)

1. Download [Obsidian](https://obsidian.md/)
2. Open vault: `File → Open vault → obsidian_vault/`
3. Explore graph: `Ctrl+G` (Windows/Linux) or `Cmd+G` (Mac)

### Preview in Browser

```bash
# Install local server
pip install mkdocs mkdocs-material

# Serve vault (alternative to Obsidian)
python -m http.server 8000 --directory obsidian_vault/

# Open: http://localhost:8000
```

---

## Deployment Options

### Option 1: GitHub Pages (Free, Automatic)

**Setup:**

1. GitHub repo settings → Pages
2. Source: `Deploy from branch`
3. Branch: `gh-pages`
4. Save

**URL:** `https://<username>.github.io/<repo-name>`

**Custom Domain:**

```yaml
# In .github/workflows/publish_docs.yml
cname: genesis-docs.yourdomain.com
```

**DNS Configuration:**

```
CNAME: genesis-docs → <username>.github.io
```

### Option 2: Obsidian Publish (Official, $8-16/month)

**Setup:**

1. Subscribe: [obsidian.md/publish](https://obsidian.md/publish)
2. Open vault in Obsidian
3. Enable Publish core plugin
4. Select all files → Publish

**Features:**

- Custom domain support
- Password protection
- Dark/light themes
- Search
- Graph view

**Automation:**

GitHub Actions workflow creates artifact → download → publish manually

### Option 3: Obsidian Digital Garden (Free)

**Setup:**

1. Install plugin: [Digital Garden](https://github.com/oleeskild/obsidian-digital-garden)
2. Configure Vercel/Netlify integration
3. Push to GitHub → auto-deploy

**Features:**

- Free hosting
- Auto-sync from GitHub
- Custom domain
- Graph view
- Search

**Frontmatter:**

```yaml
---
dg-publish: true
dg-home: true  # Landing page
---
```

### Option 4: MkDocs Material (Custom)

**Setup:**

```bash
# Install
pip install mkdocs mkdocs-material

# Configure mkdocs.yml
site_name: Genesis Knowledge Base
theme:
  name: material

# Build
mkdocs build

# Deploy to Netlify/Vercel
```

---

## Customization

### Custom Categorization

Edit `export_docs_obsidian.py`:

```python
def _categorize_file(self, filepath: Path, frontmatter: Dict) -> str:
    # Add custom category logic
    if 'api' in str(filepath).lower():
        return 'API'

    # Or use frontmatter
    if 'category' in frontmatter:
        return frontmatter['category']
```

### Custom Frontmatter

Edit `transform_markdown()`:

```python
frontmatter = {
    'title': md_file.title,
    'category': md_file.category,
    'dg-publish': True,
    'author': 'Genesis Team',  # Add custom fields
    'version': '1.0',
    'status': 'published'
}
```

### Custom Link Transformation

Edit `_transform_links()`:

```python
# Example: Preserve some markdown links
if url.startswith('http://') or url.startswith('https://'):
    return match.group(0)  # Keep external links

# Transform internal links
if url.endswith('.md'):
    return f"[[{Path(url).stem}|{text}]]"
```

### Custom MOC Generation

Edit `generate_knowledge_graph.py`:

```python
async def _generate_main_moc(self, output_dir: Path) -> None:
    content = f"""
# Custom Knowledge Base Index

Your custom introduction here.

## Statistics
...
"""
```

---

## Troubleshooting

### Issue: Broken Links

**Symptom:** `[[MISSING_FILE]]` shows as broken in Obsidian

**Diagnosis:**

```bash
# Check for broken links
grep -r "\[\[" obsidian_vault/ | grep -v "_attachments"
```

**Fix:**

1. Ensure target file was exported (check category)
2. Verify link target matches filename (case-sensitive)
3. Re-run export

### Issue: Images Not Showing

**Symptom:** `![[image.png]]` shows broken image

**Diagnosis:**

```bash
# Check if images were copied
ls -la obsidian_vault/_attachments/

# Check export report
python scripts/export_docs_obsidian.py 2>&1 | grep "Images copied"
```

**Fix:**

1. Verify image exists in source: `find . -name "image.png"`
2. Check image path in markdown (relative to file)
3. Re-run export

### Issue: GitHub Actions Failure

**Symptom:** Workflow fails on push

**Diagnosis:**

```bash
# Check logs
gh run list
gh run view <run-id> --log
```

**Common Causes:**

1. **Missing dependencies**: Add to `publish_docs.yml`
2. **Python version**: Ensure 3.12 in workflow
3. **Path issues**: Use absolute paths in scripts

**Fix:**

```yaml
# Add to workflow
- name: Debug paths
  run: |
    pwd
    ls -la
    python --version
```

### Issue: Category Missing

**Symptom:** File not in expected category

**Diagnosis:**

```python
# Add debug logging to export_docs_obsidian.py
logger.info(f"File: {filepath}, Category: {category}")
```

**Fix:**

1. Check categorization logic in `_categorize_file()`
2. Add frontmatter: `category: YourCategory`
3. Re-run export

### Issue: Duplicate Files

**Symptom:** Multiple files with same name

**Diagnosis:**

```bash
# Find duplicates
find obsidian_vault/ -name "*.md" | xargs -n1 basename | sort | uniq -d
```

**Fix:**

1. Rename files in source (use unique names)
2. Use subdirectories: `Architecture/Layer1/`, `Architecture/Layer2/`

---

## Advanced Topics

### Custom Graph Queries

**NetworkX Graph Analysis:**

```python
# Load graph
import json
import networkx as nx

with open('obsidian_vault/graph_data.json', 'r') as f:
    data = json.load(f)

G = nx.DiGraph()
for edge in data['edges']:
    G.add_edge(edge['source'], edge['target'])

# Find shortest path
path = nx.shortest_path(G, 'PROJECT_STATUS', 'ARCHITECTURE')

# Find most central nodes (PageRank)
pr = nx.pagerank(G)
top_nodes = sorted(pr.items(), key=lambda x: x[1], reverse=True)[:10]

# Find communities
communities = nx.community.greedy_modularity_communities(G.to_undirected())
```

### Automated Link Suggestions

**Find Related Documents:**

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Extract text from all files
texts = []
filenames = []
for md_file in vault_files:
    with open(md_file, 'r') as f:
        texts.append(f.read())
    filenames.append(md_file.stem)

# Compute TF-IDF
vectorizer = TfidfVectorizer()
tfidf = vectorizer.fit_transform(texts)

# Find similar documents
similarity = cosine_similarity(tfidf)

# Suggest links for a document
doc_idx = 0
similar_docs = similarity[doc_idx].argsort()[-5:][::-1]
print(f"Similar to {filenames[doc_idx]}:")
for idx in similar_docs:
    print(f"  - {filenames[idx]}: {similarity[doc_idx][idx]:.2f}")
```

### Continuous Deployment

**Auto-deploy on every commit:**

```yaml
# In .github/workflows/publish_docs.yml
on:
  push:
    branches: [main]
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight
```

**Incremental Exports (Future Enhancement):**

```python
# Track last export timestamp
import pickle
from datetime import datetime

last_export = datetime.fromtimestamp(
    Path('obsidian_vault/.last_export').stat().st_mtime
)

# Only export changed files
for md_file in changed_files:
    if md_file.stat().st_mtime > last_export.timestamp():
        export_file(md_file)
```

### Multi-Vault Support

**Organize by project:**

```bash
# Export multiple projects
python scripts/export_docs_obsidian.py \
  /genesis-rebuild \
  /multi-vault/genesis

python scripts/export_docs_obsidian.py \
  /other-project \
  /multi-vault/other

# Combine in Obsidian
# Open /multi-vault as root vault
```

---

## Statistics & Performance

### Current Export Metrics

- **Total Files Scanned**: 401
- **Files Exported**: 383
- **Files Skipped**: 18 (internal)
- **Links Transformed**: 12
- **Images Copied**: 0 (none in current docs)
- **Export Time**: ~0.5 seconds
- **Graph Build Time**: ~0.3 seconds

### Category Distribution

| Category | Files | Percentage |
|----------|-------|------------|
| Reports | 244 | 63.7% |
| Architecture | 101 | 26.4% |
| Guides | 13 | 3.4% |
| Testing | 12 | 3.1% |
| Core | 9 | 2.3% |
| Planning | 3 | 0.8% |
| Research | 1 | 0.3% |

### Knowledge Graph Statistics

- **Total Nodes**: 376
- **Total Edges**: 14 (direct links)
- **Tag Edges**: 6,286 (shared tags)
- **Hub Nodes**: 17 with 5+ connections
- **Isolated Nodes**: 359 (no links)
- **Average Connections**: 0.04 per node

---

## Resources

### Official Documentation

- [Obsidian Help](https://help.obsidian.md/)
- [Obsidian Publish Guide](https://help.obsidian.md/Plugins/Publish)
- [Obsidian Digital Garden](https://github.com/oleeskild/obsidian-digital-garden)

### Genesis System

- [[PROJECT_STATUS|Project Status]] - Current progress
- [[CLAUDE|CLAUDE.md]] - Agent instructions
- [[Architecture/INDEX|Architecture Index]] - System design

### Scripts

- `scripts/export_docs_obsidian.py` - Main export script (631 lines)
- `scripts/generate_knowledge_graph.py` - Graph generation (445 lines)
- `.github/workflows/publish_docs.yml` - CI/CD automation (247 lines)

---

## Support & Contribution

### Report Issues

- GitHub Issues: Create issue with `[docs]` label
- Include: error logs, file paths, expected behavior

### Contribute

1. Fork repository
2. Modify `scripts/export_docs_obsidian.py` or `generate_knowledge_graph.py`
3. Test: `python scripts/export_docs_obsidian.py`
4. Submit PR with description

### Enhancement Ideas

- [ ] Incremental exports (only changed files)
- [ ] Automated link suggestions (ML-based)
- [ ] Visual graph editor integration
- [ ] Multi-language support
- [ ] PDF export
- [ ] Full-text search UI

---

*Last updated: 2025-10-24*

*Generated from Genesis Obsidian Export System v1.0*
