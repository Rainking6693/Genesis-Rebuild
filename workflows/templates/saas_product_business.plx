# SaaS Product Business Workflow Template
# Generated for Genesis Meta-Agent autonomous business creation

[domain]
name = "saas_product"
version = "1.0.0"
description = "SaaS product with dashboard, API, and subscription billing"

# Concept: ProductSpec
[[concept]]
name = "ProductSpec"
description = "SaaS product specifications"
fields = [
  { name = "features", type = "list<string>" },
  { name = "api_endpoints", type = "list<string>" },
  { name = "pricing_tiers", type = "string" }
]

# Concept: DashboardUI
[[concept]]
name = "DashboardUI"
description = "SaaS dashboard interface"
fields = [
  { name = "components", type = "list<string>" },
  { name = "layout", type = "string" }
]

# Concept: APICode
[[concept]]
name = "APICode"
description = "Backend API implementation"
fields = [
  { name = "endpoints", type = "list<string>" },
  { name = "authentication", type = "string" }
]

# Pipe 1: Create Product Spec
[[pipe]]
name = "define_product"
type = "PipeLLM"
provider = "anthropic"
model = "claude-sonnet-4"
system_prompt = """You are a product manager defining SaaS products.
Create detailed specifications with features, pricing, and API design."""
user_prompt = "Define SaaS product for {{problem_space}}"
output = { concept = "ProductSpec" }

# Pipe 2: Build Dashboard (parallel)
[[pipe]]
name = "build_dashboard"
type = "PipeLLM"
provider = "openai"
model = "gpt-4o"
system_prompt = """You are a frontend developer building SaaS dashboards.
Create React components with TypeScript and modern UI libraries."""
user_prompt = "Build dashboard for {{ProductSpec}}"
output = { concept = "DashboardUI" }

# Pipe 3: Build API (parallel)
[[pipe]]
name = "build_api"
type = "PipeLLM"
provider = "anthropic"
model = "claude-sonnet-4"
system_prompt = """You are a backend developer building SaaS APIs.
Create FastAPI or Express.js endpoints with authentication."""
user_prompt = "Build API for {{ProductSpec}}"
output = { concept = "APICode" }

# Pipe 4: Parallel execution
[[pipe]]
name = "build_saas"
type = "PipeParallel"
pipes = ["build_dashboard", "build_api"]
