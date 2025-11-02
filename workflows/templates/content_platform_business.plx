# Content Platform Business Workflow Template
# Generated for Genesis Meta-Agent autonomous business creation
# v0.14.3 format

domain = "content_platform"
description = "Content platform with blog, newsletter, and SEO optimization"

[concept]
ContentStrategy = "Content planning and strategy with topics, keywords, and content calendar"
BlogPosts = "Collection of blog posts with total count"
PlatformDesign = "Content platform design with homepage, blog template, and newsletter signup"
Niche = "The specific niche for the content platform"

[pipe]
[pipe.create_strategy]
type = "PipeLLM"
description = "Generate comprehensive content strategy with topics, keywords, and calendar"
inputs = { niche = "Niche" }
output = "ContentStrategy"
model = "llm_to_engineer"
prompt = """
Create a comprehensive content strategy for a {{niche}} platform.

Include:
- 10-15 core topics
- 20-30 SEO keywords
- 3-month content calendar
- Content types (how-to, listicles, case studies, etc.)
- Target audience personas

Output JSON matching the ContentStrategy concept.
"""

[pipe.write_posts]
type = "PipeLLM"
description = "Generate SEO-optimized blog posts with engaging headlines"
inputs = { content_strategy = "ContentStrategy" }
output = "BlogPosts"
model = "llm_to_engineer"
prompt = """
Write 10 SEO-optimized blog posts based on this content strategy:
@content_strategy

For each post create:
- Engaging headline (50-60 characters)
- Meta description (150-160 characters)
- Full article content (1000-1500 words)
- Internal linking suggestions
- Call-to-action

Output JSON matching the BlogPosts concept.
"""

[pipe.design_platform]
type = "PipeLLM"
description = "Design clean, readable content platform with focus on content"
inputs = { niche = "Niche" }
output = "PlatformDesign"
model = "llm_to_engineer"
prompt = """
Design a content platform for {{niche}}.

Create:
- Homepage with hero, featured posts, and categories
- Blog post template with optimal reading experience
- Newsletter signup component with conversion optimization
- Responsive CSS with typography focus
- Accessibility features

Output JSON matching the PlatformDesign concept.
"""

[pipe.build_platform]
type = "PipeParallel"
description = "Execute content and design generation in parallel"
inputs = { niche = "Niche", content_strategy = "ContentStrategy" }
output = "PlatformDesign"
parallels = [
  { pipe = "write_posts", result = "blog_posts" },
  { pipe = "design_platform", result = "platform_design" }
]
add_each_output = true

[pipe.content_platform_pipeline]
type = "PipeSequence"
description = "Main entry point - executes full content platform creation pipeline"
inputs = { niche = "Niche" }
output = "PlatformDesign"
steps = [
  { pipe = "create_strategy", result = "content_strategy" },
  { pipe = "build_platform", result = "platform_complete" }
]
