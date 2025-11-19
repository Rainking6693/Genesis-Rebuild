# VOIX in 10 Minutes: Quick Start Guide for Websites

This guide shows website owners how to add VOIX support to their sites in under 10 minutes.

## What is VOIX?

VOIX (Voice of Intent eXchange) lets your website communicate directly with AI agents, making automation faster and more reliable. Instead of agents parsing your HTML, you declare what actions are available.

**Benefits:**
- 10-25x faster automation
- 99%+ success rate
- Zero maintenance (no brittle selectors)
- Better user experience for AI-powered tools

## Quick Start

### Step 1: Add a Tool Tag

Add a `<tool>` tag to your HTML where you want to expose an action:

```html
<tool
  name="submit_product"
  description="Submit product to directory"
  endpoint="https://api.example.com/submit"
  method="POST"
  parameters='{"type":"object","properties":{"name":{"type":"string"},"url":{"type":"string"}},"required":["name"]}'
/>
```

### Step 2: Add a Context Tag (Optional)

Add a `<context>` tag to expose structured data:

```html
<context
  name="product_price"
  value="29.99"
  scope="page"
/>
```

That's it! Your site now supports VOIX.

## HTML Examples

### Product Submission Form

```html
<form id="product-form">
  <input type="text" name="name" placeholder="Product Name" />
  <input type="url" name="url" placeholder="Product URL" />
  <button type="submit">Submit</button>
</form>

<!-- VOIX Tool Declaration -->
<tool
  name="submit_product"
  description="Submit product to directory"
  endpoint="/api/submit"
  method="POST"
  selector="#product-form"
  parameters='{
    "type": "object",
    "properties": {
      "name": {"type": "string", "description": "Product name"},
      "url": {"type": "string", "format": "uri", "description": "Product URL"}
    },
    "required": ["name", "url"]
  }'
/>
```

### Deployment Platform

```html
<div id="deploy-section">
  <input type="text" id="repo-url" placeholder="GitHub URL" />
  <button id="deploy-btn">Deploy</button>
</div>

<!-- VOIX Tool Declaration -->
<tool
  name="deploy_repository"
  description="Deploy GitHub repository"
  endpoint="/api/deploy"
  method="POST"
  auth="bearer"
  selector="#deploy-section"
  parameters='{
    "type": "object",
    "properties": {
      "github_url": {"type": "string", "format": "uri"},
      "environment": {"type": "string", "enum": ["production", "staging"]}
    },
    "required": ["github_url"]
  }'
/>
```

### E-commerce Product Page

```html
<div class="product">
  <h1>Amazing Product</h1>
  <p class="price">$29.99</p>
  <p class="availability">In Stock</p>
</div>

<!-- VOIX Context Tags -->
<context name="product_price" value="29.99" scope="page" />
<context name="product_availability" value="in_stock" scope="page" />
<context name="product_name" value="Amazing Product" scope="page" />
```

## Parameter Schemas

Use JSON Schema to define tool parameters:

```json
{
  "type": "object",
  "properties": {
    "name": {"type": "string"},
    "email": {"type": "string", "format": "email"},
    "age": {"type": "integer", "minimum": 18},
    "tags": {"type": "array", "items": {"type": "string"}}
  },
  "required": ["name", "email"]
}
```

**Supported Types:**
- `string` (with `format`: `email`, `uri`, `date`, etc.)
- `number` / `integer` (with `minimum`, `maximum`)
- `boolean`
- `array` (with `items` schema)
- `object` (with nested `properties`)

## Authentication Options

### No Authentication
```html
<tool name="public_tool" endpoint="/api/public" auth="none" />
```

### Bearer Token
```html
<tool name="protected_tool" endpoint="/api/protected" auth="bearer" />
```
Agents will include `Authorization: Bearer <token>` header.

### Session Cookies
```html
<tool name="session_tool" endpoint="/api/session" auth="session" />
```
Agents will include session cookies from the browser.

## Dynamic Content Handling

VOIX automatically detects dynamically added tools via MutationObserver. Just add tool tags to the DOM:

```javascript
// Dynamically add a tool
const tool = document.createElement('tool');
tool.setAttribute('name', 'dynamic_tool');
tool.setAttribute('endpoint', '/api/dynamic');
tool.setAttribute('method', 'POST');
document.body.appendChild(tool);
```

## Best Practices

1. **Use descriptive names**: `submit_product` not `tool1`
2. **Provide clear descriptions**: Help agents understand tool purpose
3. **Validate parameters**: Use JSON Schema to enforce types
4. **Handle errors gracefully**: Return clear error messages
5. **Use context tags**: Expose structured data, not just tools
6. **Test with agents**: Verify tools work with real agents

## Troubleshooting

**Tool not detected?**
- Check tag syntax (must be `<tool>` not `<div data-tool>`)
- Verify endpoint URL is absolute or relative
- Ensure parameters JSON is valid

**Authentication failing?**
- Verify `auth` attribute matches your API requirements
- Check token/cookie format

**Parameters invalid?**
- Validate JSON Schema syntax
- Ensure required parameters are marked

## Next Steps

- Read the full [VOIX Integration Guide](VOIX_INTEGRATION.md)
- See [Adoption Guide](VOIX_ADOPTION_GUIDE.md) for business benefits
- Check [Sample Website](../examples/voix_sample_website.html) for reference

