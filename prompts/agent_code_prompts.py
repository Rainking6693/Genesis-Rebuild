"""Agent code generation prompts for Genesis business components."""

from typing import Dict

# Component-specific prompt templates
COMPONENT_PROMPTS: Dict[str, str] = {
    "landing page": """Generate a modern, responsive landing page component in TypeScript/React.
Requirements:
- Use Next.js 14 App Router conventions
- Include TypeScript types for all props
- Use Tailwind CSS for styling
- Include a hero section, features section, and CTA
- Make it responsive and accessible
- Output ONLY the TypeScript/TSX code, no explanations

Example structure:
```typescript
export default function LandingPage() {{
  return (
    <div className="min-h-screen">
      {/* Hero section */}
      {/* Features section */}
      {/* CTA section */}
    </div>
  );
}}
```""",

    "dashboard": """Generate a dashboard component in TypeScript/React.
Requirements:
- Use Next.js 14 App Router conventions
- Include TypeScript types for all props
- Use Tailwind CSS for styling
- Include metrics cards, charts placeholder, and navigation
- Make it responsive
- Output ONLY the TypeScript/TSX code, no explanations

Example structure:
```typescript
export default function Dashboard() {{
  return (
    <div className="p-6">
      {/* Metrics cards */}
      {/* Charts area */}
      {/* Data table */}
    </div>
  );
}}
```""",

    "api route": """Generate a Next.js 14 API route in TypeScript.
Requirements:
- Use Next.js 14 App Router API conventions (route.ts)
- Include proper TypeScript types
- Handle GET and POST methods
- Include error handling
- Return JSON responses
- Output ONLY the TypeScript code, no explanations

Example structure:
```typescript
import {{ NextRequest, NextResponse }} from 'next/server';

export async function GET(request: NextRequest) {{
  try {{
    // Implementation
    return NextResponse.json({{ success: true, data: [] }});
  }} catch (error) {{
    return NextResponse.json({{ error: 'Failed' }}, {{ status: 500 }});
  }}
}}

export async function POST(request: NextRequest) {{
  try {{
    const body = await request.json();
    // Implementation
    return NextResponse.json({{ success: true }});
  }} catch (error) {{
    return NextResponse.json({{ error: 'Failed' }}, {{ status: 500 }});
  }}
}}
```""",

    "payment integration": """Generate a Stripe payment integration component in TypeScript/React.
Requirements:
- Use @stripe/stripe-js and @stripe/react-stripe-js
- Include TypeScript types
- Create a payment form component
- Handle payment intents
- Include error handling
- Output ONLY the TypeScript/TSX code, no explanations

Example structure:
```typescript
'use client';
import {{ Elements }} from '@stripe/react-stripe-js';
import {{ loadStripe }} from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

export default function PaymentForm() {{
  return (
    <Elements stripe={{stripePromise}}>
      {/* Payment form */}
    </Elements>
  );
}}
```""",

    "authentication": """Generate an authentication component in TypeScript/React.
Requirements:
- Create login and signup forms
- Include TypeScript types
- Use Next.js 14 conventions
- Include form validation
- Handle authentication state
- Output ONLY the TypeScript/TSX code, no explanations

Example structure:
```typescript
'use client';
import {{ useState }} from 'react';

export default function AuthForm() {{
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="max-w-md mx-auto">
      {/* Auth form */}
    </div>
  );
}}
```""",
}

# Business-type specific enhancements
BUSINESS_TYPE_CONTEXTS: Dict[str, str] = {
    "ecommerce": """This is for an e-commerce business. Include:
- Product display capabilities
- Shopping cart integration considerations
- Checkout flow elements
- Order management features""",

    "saas": """This is for a SaaS product. Include:
- Subscription management elements
- User dashboard features
- Analytics display
- Account settings""",

    "content platform": """This is for a content platform. Include:
- Content display and organization
- User-generated content features
- Content management capabilities
- Social features (likes, comments, sharing)""",

    "marketplace": """This is for a marketplace platform. Include:
- Buyer and seller interfaces
- Transaction handling
- Review and rating systems
- Search and filter capabilities""",

    "generic": """This is for a general web application. Include:
- Clean, modern design
- User-friendly interface
- Responsive layout
- Accessibility considerations""",
}


def get_component_prompt(component_name: str, business_type: str = "generic") -> str:
    """
    Generate a prompt for creating a specific component.

    Args:
        component_name: Name of the component to generate (e.g., "landing page", "dashboard")
        business_type: Type of business (e.g., "ecommerce", "saas", "generic")

    Returns:
        A detailed prompt string for generating the component
    """
    # Normalize component name
    component_key = component_name.lower().strip()

    # Try to find exact match in COMPONENT_PROMPTS
    base_prompt = None
    for key, prompt in COMPONENT_PROMPTS.items():
        if key in component_key or component_key in key:
            base_prompt = prompt
            break

    # If no match, use generic TypeScript prompt
    if base_prompt is None:
        base_prompt = get_generic_typescript_prompt(component_name)

    # Add business context
    business_context = BUSINESS_TYPE_CONTEXTS.get(business_type.lower(), BUSINESS_TYPE_CONTEXTS["generic"])

    # Combine into final prompt
    final_prompt = f"""TASK: Generate {component_name} component

BUSINESS CONTEXT:
{business_context}

{base_prompt}

CRITICAL REQUIREMENTS:
1. Output ONLY valid TypeScript/TSX code
2. NO Python code
3. NO markdown formatting (no ```typescript``` blocks)
4. NO explanations or comments outside the code
5. Use Next.js 14 App Router conventions
6. Include proper TypeScript types
7. Use Tailwind CSS for styling
8. Make it production-ready

Begin with imports and end with the component export."""

    return final_prompt


def get_generic_typescript_prompt(component_name: str) -> str:
    """
    Generate a generic prompt for TypeScript component creation.

    Args:
        component_name: Name of the component

    Returns:
        A generic TypeScript component prompt
    """
    return f"""Generate a {component_name} component in TypeScript/React.

Requirements:
- Use Next.js 14 App Router conventions
- Include TypeScript types for all props and state
- Use Tailwind CSS for styling
- Follow React best practices
- Make it responsive and accessible
- Include proper error handling
- Output ONLY the TypeScript/TSX code, no explanations

Structure:
```typescript
'use client'; // If component uses hooks/client features

import {{ useState, useEffect }} from 'react';

interface Props {{
  // Define props
}}

export default function Component(props: Props) {{
  return (
    <div className="container mx-auto p-4">
      {{/* Component implementation */}}
    </div>
  );
}}
```

Generate complete, working code for the {component_name} component."""


# Export all functions
__all__ = ['get_component_prompt', 'get_generic_typescript_prompt']
