# SaaS Product Business Workflow Template
# Generated for Genesis Meta-Agent autonomous business creation
# v0.14.3 format

domain = "saas_product"
description = "SaaS product with dashboard, API, and subscription billing"

[concept]
ProductSpec = "SaaS product specifications with features, API endpoints, and pricing tiers"
DashboardUI = "SaaS dashboard interface with components and layout"
APICode = "Backend API implementation with endpoints and authentication"
ProblemSpace = "The problem space or use case for the SaaS product"
SaaSBundle = "Combined bundle of dashboard UI and API code"

[pipe]
[pipe.define_product]
type = "PipeLLM"
description = "Create detailed SaaS product specifications with features, pricing, and API design"
inputs = { problem_space = "ProblemSpace" }
output = "ProductSpec"
model = "llm_to_engineer"
prompt = """
Define a SaaS product for this problem space: {{problem_space}}

Create detailed specifications including:
- Core features (5-10 key features)
- User personas and use cases
- Pricing tiers (Free, Starter, Professional, Enterprise)
- API endpoints design (REST or GraphQL)
- Data models and relationships
- Security requirements
- Integration possibilities

Output JSON matching the ProductSpec concept.
"""

[pipe.build_dashboard]
type = "PipeLLM"
description = "Build SaaS dashboard with React components, TypeScript, and modern UI libraries"
inputs = { product_spec = "ProductSpec" }
output = "DashboardUI"
model = "llm_to_engineer"
prompt = """
Build a SaaS dashboard for this product:
@product_spec

Create React components with TypeScript:
- Authentication screens (login, signup, password reset)
- Main dashboard with KPIs and metrics
- Feature-specific pages
- Settings and billing pages
- Responsive layout with mobile support
- Component library (buttons, forms, tables, charts)

Use modern UI frameworks (Tailwind CSS, Shadcn UI, or similar).

Output JSON matching the DashboardUI concept.
"""

[pipe.build_api]
type = "PipeLLM"
description = "Build backend API with FastAPI or Express.js, including authentication and endpoints"
inputs = { product_spec = "ProductSpec" }
output = "APICode"
model = "llm_to_engineer"
prompt = """
Build a backend API for this product:
@product_spec

Create API implementation:
- Authentication system (JWT or OAuth)
- User management endpoints
- Feature-specific endpoints matching product spec
- Database models (SQL or NoSQL)
- Input validation and error handling
- Rate limiting and security middleware
- API documentation (OpenAPI/Swagger)

Use FastAPI (Python) or Express.js (Node.js).

Output JSON matching the APICode concept.
"""

[pipe.build_saas]
type = "PipeParallel"
description = "Execute dashboard and API development in parallel"
inputs = { product_spec = "ProductSpec" }
output = "SaaSBundle"
parallels = [
  { pipe = "build_dashboard", result = "dashboard_ui" },
  { pipe = "build_api", result = "api_code" }
]
add_each_output = true

[pipe.saas_product_pipeline]
type = "PipeSequence"
description = "Main entry point - executes full SaaS product creation pipeline"
inputs = { problem_space = "ProblemSpace" }
output = "SaaSBundle"
steps = [
  { pipe = "define_product", result = "product_spec" },
  { pipe = "build_saas", result = "saas_bundle" }
]
