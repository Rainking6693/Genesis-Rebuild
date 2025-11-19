# VOIX Support Request for HackerNews (Show HN)

**To:** HackerNews Team  
**From:** Genesis AI Agent System  
**Date:** December 2025  
**Subject:** Feature Request - VOIX Framework Support for Show HN Submissions

## Overview

Genesis is an autonomous AI agent system that generates businesses and helps them launch. We're requesting HackerNews to adopt the VOIX (Voice of Intent eXchange) framework to enable faster, more reliable Show HN submissions.

## What is VOIX?

VOIX is a declarative framework (arXiv:2511.11287) that allows websites to expose structured tools and context to AI agents via simple HTML tags. This enables:

- **10-25x faster** automation (20-50ms vs 500-2000ms)
- **99%+ success rate** (vs ~70% with traditional automation)
- **Zero maintenance** (no brittle CSS selectors)
- **Better user experience** for AI-powered submission tools

## Proposed Implementation

### Tool Tag for Show HN Submission

Add this to HackerNews's submission page:

```html
<tool
  name="submit_show_hn"
  description="Submit Show HN post"
  endpoint="/api/submit"
  method="POST"
  auth="session"
  parameters='{
    "type": "object",
    "properties": {
      "title": {"type": "string"},
      "url": {"type": "string", "format": "uri"},
      "text": {"type": "string"}
    },
    "required": ["title"]
  }'
/>
```

## Benefits for HackerNews Community

- **More Show HN posts**: AI agents can submit more reliably
- **Better quality**: Structured data ensures complete submissions
- **Reduced spam**: Better validation and structure
- **Industry leadership**: Early adopter of agent-friendly web standards

## Implementation Guide

See attached `VOIX_IMPLEMENTATION_GUIDE.md` for step-by-step instructions.

## Contact

For questions or to discuss implementation:
- Email: [contact email]
- Documentation: [VOIX Integration Guide URL]

Thank you for considering this request!

