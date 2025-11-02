# Content Platform Business Workflow Template
# Generated for Genesis Meta-Agent autonomous business creation

[domain]
name = "content_platform"
version = "1.0.0"
description = "Content platform with blog, newsletter, and SEO optimization"

# Concept: ContentStrategy
[[concept]]
name = "ContentStrategy"
description = "Content planning and strategy"
fields = [
  { name = "topics", type = "list<string>" },
  { name = "keywords", type = "list<string>" },
  { name = "content_calendar", type = "string" }
]

# Concept: BlogPosts
[[concept]]
name = "BlogPosts"
description = "Collection of blog posts"
fields = [
  { name = "posts", type = "list<string>" },
  { name = "total_posts", type = "integer" }
]

# Concept: PlatformDesign
[[concept]]
name = "PlatformDesign"
description = "Content platform design"
fields = [
  { name = "homepage", type = "string" },
  { name = "blog_template", type = "string" },
  { name = "newsletter_signup", type = "string" }
]

# Pipe 1: Generate Content Strategy
[[pipe]]
name = "create_strategy"
type = "PipeLLM"
provider = "anthropic"
model = "claude-haiku-4.5"
system_prompt = """You are a content strategist.
Create a comprehensive content strategy with topics, keywords, and calendar."""
user_prompt = "Create content strategy for {{niche}} platform"
output = { concept = "ContentStrategy" }

# Pipe 2: Generate Blog Posts (parallel)
[[pipe]]
name = "write_posts"
type = "PipeLLM"
provider = "anthropic"
model = "claude-sonnet-4"
system_prompt = """You are a professional content writer.
Create SEO-optimized blog posts with engaging headlines."""
user_prompt = "Write 10 blog posts for {{ContentStrategy}}"
output = { concept = "BlogPosts" }

# Pipe 3: Design Platform (parallel)
[[pipe]]
name = "design_platform"
type = "PipeLLM"
provider = "openai"
model = "gpt-4o"
system_prompt = """You are a UX designer for content platforms.
Create clean, readable designs with focus on content."""
user_prompt = "Design content platform for {{niche}}"
output = { concept = "PlatformDesign" }

# Pipe 4: Parallel execution
[[pipe]]
name = "build_platform"
type = "PipeParallel"
pipes = ["write_posts", "design_platform"]
