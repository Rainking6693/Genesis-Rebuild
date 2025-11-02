# E-commerce Business Workflow Template
# Generated for Genesis Meta-Agent autonomous business creation
# v0.14.3 format

domain = "ecommerce_business"
description = "Complete e-commerce business with product catalog, checkout, and marketing"

[concept]
ProductCatalog = "Collection of products with categories, including products list, categories list, and total product count"
Product = "Individual product with id, name, price, description, image URL, and category"
WebsiteDesign = "E-commerce website design specifications with homepage HTML, product page HTML, CSS styles, and brand colors"
CheckoutCode = "Stripe checkout integration code including checkout component, payment handler, and success page"
EmailCampaigns = "Marketing email campaigns collection with list of campaigns and total count"
DeploymentURL = "Deployed website URL with deployment status"
BusinessNiche = "The specific business niche for the e-commerce store"
ComponentsBundle = "Combined bundle of catalog, website design, and checkout code"

[pipe]
[pipe.generate_catalog]
type = "PipeLLM"
description = "Generate product catalog via Content Agent - creates realistic products with descriptions, prices, and categories"
inputs = { business_niche = "BusinessNiche" }
output = "ProductCatalog"
model = "llm_to_engineer"
prompt = """
Generate a product catalog for a {{business_niche}} e-commerce store.

Create 20 realistic products with:
- Unique product IDs
- Product names
- Prices (realistic for the niche)
- Detailed descriptions
- Image URLs (placeholder format)
- Categories

Output JSON matching the ProductCatalog concept.
"""

[pipe.design_website]
type = "PipeLLM"
description = "Design website in parallel with catalog - creates modern responsive e-commerce UI"
inputs = { business_niche = "BusinessNiche" }
output = "WebsiteDesign"
model = "llm_to_engineer"
prompt = """
Design a modern e-commerce website for {{business_niche}}.

Create:
- Homepage HTML with hero section, featured products, and call-to-action
- Product page HTML template
- Responsive CSS styles with mobile-first approach
- Brand color palette (3-5 colors)

Output JSON matching the WebsiteDesign concept.
"""

[pipe.generate_checkout]
type = "PipeLLM"
description = "Generate Stripe checkout integration in parallel - creates payment processing code"
inputs = { business_niche = "BusinessNiche" }
output = "CheckoutCode"
model = "llm_to_engineer"
prompt = """
Create a Stripe checkout integration for {{business_niche}}.

Generate TypeScript React components:
- Checkout component with Stripe Elements
- Payment handler with error handling
- Success confirmation page

Output JSON matching the CheckoutCode concept.
"""

[pipe.build_components]
type = "PipeParallel"
description = "Execute catalog, design, and checkout generation in parallel"
inputs = { business_niche = "BusinessNiche" }
output = "ComponentsBundle"
parallels = [
  { pipe = "generate_catalog", result = "product_catalog" },
  { pipe = "design_website", result = "website_design" },
  { pipe = "generate_checkout", result = "checkout_code" }
]
add_each_output = true

[pipe.setup_email_marketing]
type = "PipeLLM"
description = "Create email marketing campaigns based on product catalog"
inputs = { business_niche = "BusinessNiche", product_catalog = "ProductCatalog" }
output = "EmailCampaigns"
model = "llm_to_engineer"
prompt = """
Create 5 email marketing campaigns for {{business_niche}} customers.

Based on this product catalog:
@product_catalog

Create campaigns for:
1. Welcome series for new customers
2. Abandoned cart recovery
3. New product announcements
4. Seasonal promotions
5. Customer retention/loyalty

Output JSON matching the EmailCampaigns concept.
"""

[pipe.deploy_website]
type = "PipeLLM"
description = "Generate Vercel deployment configuration and instructions"
inputs = { website_design = "WebsiteDesign", checkout_code = "CheckoutCode", product_catalog = "ProductCatalog", email_campaigns = "EmailCampaigns" }
output = "DeploymentURL"
model = "llm_to_engineer"
prompt = """
Generate Vercel deployment configuration.

Components to deploy:
- Website: @website_design
- Checkout: @checkout_code
- Catalog: @product_catalog
- Marketing: @email_campaigns

Create deployment config with:
- Vercel configuration file
- Environment variables for Stripe and email services
- Build commands
- Deployment URL (placeholder)

Output JSON matching the DeploymentURL concept.
"""

[pipe.ecommerce_pipeline]
type = "PipeSequence"
description = "Main entry point - executes full e-commerce business creation pipeline"
inputs = { business_niche = "BusinessNiche" }
output = "DeploymentURL"
steps = [
  { pipe = "build_components", result = "components" },
  { pipe = "setup_email_marketing", result = "email_campaigns" },
  { pipe = "deploy_website", result = "deployment_url" }
]
