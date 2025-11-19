# VOIX Implementation Guide for Platform Teams

This guide provides step-by-step instructions for implementing VOIX support on your platform.

## Step 1: Identify Automation Points (30 min)

1. List all forms/actions that agents interact with
2. Identify most common automation use cases
3. Prioritize high-traffic endpoints

## Step 2: Add Tool Tags (1-2 hours)

### Basic Tool Tag

```html
<tool
  name="action_name"
  description="Human-readable description"
  endpoint="/api/action"
  method="POST"
  parameters='{"type":"object","properties":{...},"required":[...]}'
/>
```

### With Authentication

```html
<tool
  name="protected_action"
  endpoint="/api/protected"
  auth="bearer"  <!-- or "session" -->
/>
```

### With Visibility Control

```html
<tool
  name="conditional_action"
  endpoint="/api/action"
  visibility="visible"  <!-- or "hidden" -->
  selector="#action-button"
/>
```

## Step 3: Add Context Tags (30 min)

### Basic Context

```html
<context
  name="data_name"
  value="data_value"
  scope="page"  <!-- or "session", "global" -->
/>
```

### With TTL

```html
<context
  name="time_sensitive_data"
  value="value"
  ttl="3600"  <!-- seconds -->
/>
```

## Step 4: Test Implementation (30 min)

1. Test with sample requests
2. Verify parameter validation
3. Test authentication
4. Validate responses

## Step 5: Deploy (30 min)

1. Deploy to staging
2. Test with real agents
3. Monitor performance
4. Deploy to production

## Best Practices

1. **Use descriptive names**: `submit_product` not `tool1`
2. **Provide clear descriptions**: Help agents understand purpose
3. **Validate parameters**: Use JSON Schema to enforce types
4. **Handle errors gracefully**: Return clear error messages
5. **Use context tags**: Expose structured data
6. **Test thoroughly**: Verify with real agents

## Troubleshooting

**Tool not detected?**
- Check tag syntax (must be `<tool>`)
- Verify endpoint URL
- Ensure parameters JSON is valid

**Authentication failing?**
- Verify `auth` attribute matches API requirements
- Check token/cookie format

**Parameters invalid?**
- Validate JSON Schema syntax
- Ensure required parameters are marked

## Support

- **Documentation**: [VOIX Integration Guide](../VOIX_INTEGRATION.md)
- **Developer Guide**: [VOIX in 10 Minutes](../VOIX_DEVELOPER_GUIDE.md)
- **Sample Code**: [Sample Website](../../examples/voix_sample_website.html)

