# E-commerce Business Workflow Template
# Generated for Genesis Meta-Agent autonomous business creation

[domain]
name = "ecommerce_business"
version = "1.0.0"
description = "Complete e-commerce business with product catalog, checkout, and marketing"

# Concept: ProductCatalog
[[concept]]
name = "ProductCatalog"
description = "Collection of products with categories"
fields = [
  { name = "products", type = "list<Product>" },
  { name = "categories", type = "list<string>" },
  { name = "total_products", type = "integer" }
]

# Concept: Product
[[concept]]
name = "Product"
description = "Individual product with details"
fields = [
  { name = "id", type = "string" },
  { name = "name", type = "string" },
  { name = "price", type = "float" },
  { name = "description", type = "string" },
  { name = "image_url", type = "string" },
  { name = "category", type = "string" }
]

# Concept: WebsiteDesign
[[concept]]
name = "WebsiteDesign"
description = "E-commerce website design specifications"
fields = [
  { name = "homepage_html", type = "string" },
  { name = "product_page_html", type = "string" },
  { name = "styles_css", type = "string" },
  { name = "brand_colors", type = "list<string>" }
]

# Concept: CheckoutCode
[[concept]]
name = "CheckoutCode"
description = "Stripe checkout integration code"
fields = [
  { name = "checkout_component", type = "string" },
  { name = "payment_handler", type = "string" },
  { name = "success_page", type = "string" }
]

# Concept: EmailCampaigns
[[concept]]
name = "EmailCampaigns"
description = "Marketing email campaigns"
fields = [
  { name = "campaigns", type = "list<string>" },
  { name = "total_campaigns", type = "integer" }
]

# Concept: DeploymentURL
[[concept]]
name = "DeploymentURL"
description = "Deployed website URL"
fields = [
  { name = "url", type = "string" },
  { name = "status", type = "string" }
]

# Pipe 1: Generate Product Catalog (via Content Agent)
[[pipe]]
name = "generate_catalog"
type = "PipeLLM"
provider = "anthropic"
model = "claude-haiku-4.5"
system_prompt = """You are a product designer creating an e-commerce catalog.
Generate realistic products with descriptions, prices, and categories.
Output JSON format matching the ProductCatalog concept."""
user_prompt = "Generate 20 products for a {{business_niche}} e-commerce store"
output = { concept = "ProductCatalog" }

# Pipe 2: Design Website (parallel with catalog)
[[pipe]]
name = "design_website"
type = "PipeLLM"
provider = "openai"
model = "gpt-4o"
system_prompt = """You are a web designer creating modern e-commerce websites.
Generate HTML/CSS for homepage and product pages.
Use responsive design with mobile-first approach."""
user_prompt = "Design a modern e-commerce homepage for {{business_niche}}"
output = { concept = "WebsiteDesign" }

# Pipe 3: Generate Checkout (parallel with catalog)
[[pipe]]
name = "generate_checkout"
type = "PipeLLM"
provider = "anthropic"
model = "claude-sonnet-4"
system_prompt = """You are a full-stack developer building Stripe checkout systems.
Generate React components with TypeScript for payment processing.
Include error handling and success confirmation."""
user_prompt = "Create a Stripe checkout integration for {{business_niche}}"
output = { concept = "CheckoutCode" }

# Pipe 4: Parallel Execution (catalog + design + checkout)
[[pipe]]
name = "build_components"
type = "PipeParallel"
pipes = ["generate_catalog", "design_website", "generate_checkout"]
next = "setup_email_marketing"

# Pipe 5: Email Marketing Setup
[[pipe]]
name = "setup_email_marketing"
type = "PipeLLM"
provider = "anthropic"
model = "claude-haiku-4.5"
system_prompt = """You are a marketing automation expert.
Create engaging email campaigns for customer acquisition and retention.
Include welcome series, abandoned cart, and promotional emails."""
user_prompt = "Create 5 email campaigns for {{business_niche}} customers based on {{ProductCatalog}}"
output = { concept = "EmailCampaigns" }

# Pipe 6: Deploy to Vercel (final step - currently placeholder)
[[pipe]]
name = "deploy_website"
type = "PipeLLM"
provider = "anthropic"
model = "claude-haiku-4.5"
system_prompt = """You are a deployment specialist.
Generate deployment configuration and instructions for Vercel.
Include environment variables for Stripe and email services."""
user_prompt = """Generate Vercel deployment config for:
- Website: {{WebsiteDesign}}
- Checkout: {{CheckoutCode}}
- Catalog: {{ProductCatalog}}
- Marketing: {{EmailCampaigns}}"""
output = { concept = "DeploymentURL" }
