# Agent Fix Plan - Ground Up Solution

**Problem:** Agents generate Python + reasoning text instead of clean TypeScript  
**Root Cause:** Vague 1-sentence prompts with zero guidance  
**Solution:** Complete prompt engineering + code extraction pipeline

---

## 🎯 The Core Issues

### Issue 1: Terrible Prompt (Line 83 in genesis_meta_agent.py)
```python
# CURRENT (BAD):
prompt = f"You are {agent_name}. Task: {task.description}. Generate production code."

# Example output: "You are builder_agent. Task: Build product_catalog. Generate production code."
```

**Why this fails:**
- No language specified → defaults to Python
- No format specified → includes reasoning
- No examples → no idea what "production code" means
- No constraints → verbose explanations

### Issue 2: No Code Extraction
The raw LLM response (reasoning + code blocks + explanations) is written directly to `.ts` files with zero processing.

### Issue 3: Template Variable Bug
```typescript
// Current output:
<h1>{'}}{spec.name}{{'}</h1>

// Should be:
<h1>TechGear Store</h1>
```

---

## ✅ The Fix: 3-Part Solution

### Part 1: Professional Prompts (5-10x better)

**New prompt structure:**
```
ROLE: Expert Next.js/TypeScript developer
TASK: {specific_component}
OUTPUT FORMAT: Only TypeScript code, no explanations
REQUIREMENTS:
- Next.js 14 App Router
- TypeScript with full typing
- React Server Components
- Tailwind CSS styling
- Modern best practices
EXAMPLE: [show 1-2 line example]
CONSTRAINTS:
- NO Python code
- NO explanations or reasoning
- NO markdown code fences (```)
- Start immediately with: import/export/const
```

### Part 2: Code Extraction Pipeline

**Process LLM response:**
1. Extract code blocks (```typescript...```)
2. Remove markdown fences
3. Remove explanatory text
4. Validate it's TypeScript (not Python)
5. Add missing imports if needed
6. Write clean code to file

### Part 3: Template Fix

Replace page.tsx generation to use actual values instead of template strings.

---

## 📝 Implementation Steps

### Step 1: Create Prompt Templates (10 min)

File: `prompts/agent_code_prompts.py`
```python
COMPONENT_PROMPTS = {
    "product_catalog": """
You are an expert Next.js/TypeScript developer.

TASK: Create a product catalog component for an e-commerce store.

OUTPUT FORMAT: TypeScript code ONLY, no explanations.

REQUIREMENTS:
- TypeScript with full type definitions
- Product interface (id, name, description, price, imageUrl, category, stock)
- ProductCatalog component using React Server Component pattern
- Display products in grid layout with Tailwind CSS
- Filter by category functionality
- Search functionality
- "Add to Cart" buttons

EXAMPLE:
```typescript
export interface Product {
  id: string;
  name: string;
  price: number;
  ...
}
```

IMPORTANT:
- NO Python code
- NO explanations like "Here's my approach..."
- NO markdown code fences in output
- Start immediately with: export interface...

Generate the complete TypeScript file now:
""",

    "shopping_cart": """
[Similar structure...]
""",
    
    # ... etc for all components
}
```

### Step 2: Create Code Extractor (15 min)

File: `infrastructure/code_extractor.py`
```python
import re

def extract_clean_code(llm_response: str, expected_language: str = "typescript") -> str:
    """
    Extract clean code from LLM response.
    
    Handles:
    - Code blocks (```typescript...```)
    - Explanatory text before/after code
    - Python vs TypeScript detection
    - Multiple code blocks
    """
    
    # Step 1: Try to find code blocks
    code_blocks = re.findall(r'```(?:typescript|ts|tsx)?\n(.*?)```', llm_response, re.DOTALL)
    
    if code_blocks:
        # Found explicit code blocks - use them
        code = '\n\n'.join(code_blocks)
    else:
        # No code blocks - assume entire response is code (if it starts with import/export/const/etc)
        if llm_response.strip().startswith(('import', 'export', 'const', 'function', 'interface', 'type', 'class')):
            code = llm_response.strip()
        else:
            # Last resort: try to find where code starts
            lines = llm_response.split('\n')
            code_start = None
            for i, line in enumerate(lines):
                if line.strip().startswith(('import', 'export', 'const', 'function', 'interface', 'type')):
                    code_start = i
                    break
            
            if code_start is not None:
                code = '\n'.join(lines[code_start:])
            else:
                # Give up, return as-is and let validation fail
                code = llm_response
    
    # Step 2: Validate it's TypeScript (not Python)
    if has_python_syntax(code):
        raise ValueError(f"Generated Python code instead of {expected_language}")
    
    # Step 3: Clean up
    code = code.strip()
    
    # Remove any remaining markdown artifacts
    code = re.sub(r'```.*?\n', '', code)
    code = re.sub(r'```$', '', code)
    
    return code

def has_python_syntax(code: str) -> bool:
    """Check if code contains Python-specific syntax."""
    python_indicators = [
        'def __init__',
        'self.',
        'class.*:$',  # Python class definition
        'import.*from.*import',  # Python-style imports
        '"""',  # Python docstrings
    ]
    
    for indicator in python_indicators:
        if re.search(indicator, code, re.MULTILINE):
            return True
    return False
```

### Step 3: Update GenesisMetaAgent (20 min)

**Changes to `infrastructure/genesis_meta_agent.py`:**

1. Import new modules:
```python
from prompts.agent_code_prompts import COMPONENT_PROMPTS, get_component_prompt
from infrastructure.code_extractor import extract_clean_code, has_python_syntax
```

2. Replace `_execute_task_with_llm`:
```python
def _execute_task_with_llm(self, task, agent_name):
    """Execute task with proper prompt and code extraction."""
    
    # Get component name from task
    component_name = task.description.replace("Build ", "").strip()
    
    # Get proper prompt for this component
    if component_name in COMPONENT_PROMPTS:
        prompt = COMPONENT_PROMPTS[component_name]
    else:
        # Fallback to generic but still much better prompt
        prompt = f"""
You are an expert Next.js/TypeScript developer.

TASK: Create a {component_name} component.

OUTPUT: TypeScript code ONLY. No explanations.

REQUIREMENTS:
- Next.js 14 + TypeScript
- Full type definitions
- React Server Components
- Tailwind CSS styling
- Production-ready code

CONSTRAINTS:
- NO Python
- NO explanations
- NO markdown fences
- Start with: import/export

Generate now:
"""
    
    try:
        response = self.router.execute_with_llm(
            agent_name=agent_name,
            prompt=prompt,
            fallback_to_local=True,
            max_tokens=4096,  # Increased for full components
            temperature=0.3   # Lower for more consistent code
        )
        
        if not response:
            return {"success": False, "error": "No response from LLM"}
        
        # Extract clean code
        try:
            clean_code = extract_clean_code(response, expected_language="typescript")
        except ValueError as e:
            return {"success": False, "error": f"Code extraction failed: {e}"}
        
        # Validate minimum quality
        if len(clean_code) < 100:
            return {"success": False, "error": "Generated code too short"}
        
        if has_python_syntax(clean_code):
            return {"success": False, "error": "Generated Python instead of TypeScript"}
        
        # Get cost
        cost = 0.0
        if self.router.use_vertex_ai and self.router.vertex_router:
            stats = self.router.vertex_router.get_usage_stats(agent_name)
            cost = stats.get('total_cost', 0.0)
        
        return {
            "success": True,
            "result": clean_code,  # Clean code, not raw response
            "agent": agent_name,
            "cost": cost
        }
        
    except Exception as e:
        return {"success": False, "error": str(e)}
```

3. Fix page.tsx generation (line 197-212):
```python
# Replace template string literals
page_content = f'''import {{ Metadata }} from 'next'

export const metadata: Metadata = {{
  title: '{spec.name}',
  description: '{spec.description}',
}}

export default function Home() {{
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">{spec.name}</h1>
      <p className="mt-4 text-lg">{spec.description}</p>
    </main>
  )
}}
'''
```

### Step 4: Add Retry Logic (10 min)

If code extraction fails, retry with even more explicit prompt:

```python
# In _execute_task_with_llm, add:
max_retries = 2
for attempt in range(max_retries):
    try:
        response = self.router.execute_with_llm(...)
        clean_code = extract_clean_code(response)
        # ... validate ...
        return {"success": True, "result": clean_code}
    except ValueError as e:
        if attempt == max_retries - 1:
            return {"success": False, "error": str(e)}
        # Retry with MORE explicit prompt
        prompt = f"CRITICAL: Output ONLY TypeScript code. NO Python. NO explanations.\n\n{prompt}"
```

---

## 🚀 Testing the Fix

### Test 1: Single Component
```bash
python -c "
from infrastructure.genesis_meta_agent import GenesisMetaAgent
from infrastructure.genesis_meta_agent import BusinessSpec
from pathlib import Path

agent = GenesisMetaAgent()
spec = BusinessSpec(
    name='Test Store',
    business_type='ecommerce',
    description='Test',
    components=['product_catalog'],
    output_dir=Path('test_output')
)

result = agent.generate_business(spec)
print('Success!' if result.success else 'Failed')
"
```

### Test 2: Full Business
```bash
python scripts/generate_business.py \
  --name "TechGear Store" \
  --type ecommerce \
  --output businesses/test
```

### Test 3: Build Check
```bash
cd businesses/test/techgear-store
npm install
npm run build  # Should succeed
```

---

## 📊 Expected Improvements

| Metric | Before | After |
|--------|--------|-------|
| Code language | Python | TypeScript ✅ |
| Has reasoning | Yes | No ✅ |
| Compiles | No | Yes ✅ |
| File completeness | 64% (11/17) | 100% (17/17) ✅ |
| Ready to deploy | No | Yes ✅ |
| Time to fix | N/A | ~1 hour |

---

## ⏱️ Implementation Timeline

1. **Create prompt templates** (10 min)
2. **Create code extractor** (15 min)
3. **Update GenesisMetaAgent** (20 min)
4. **Test single component** (5 min)
5. **Regenerate all 3 businesses** (15 min)
6. **Test builds** (15 min)
7. **Deploy to Vercel** (20 min)

**Total: ~1.5 hours to working deployed businesses**

---

## ✅ Validation Checklist

After fixes, each business must pass:

- [ ] All .ts files are valid TypeScript
- [ ] No Python code anywhere
- [ ] No LLM reasoning/explanations
- [ ] All 17 component files exist
- [ ] page.tsx has no template variables
- [ ] `npm install` succeeds
- [ ] `npm run build` succeeds (zero errors)
- [ ] `npm run dev` runs successfully
- [ ] Can deploy to Vercel
- [ ] Deployed URL loads and works

---

## 🎯 Root Cause Summary

**The 1-Line Problem:**
```python
prompt = f"You are {agent_name}. Task: {task.description}. Generate production code."
```

**Why it failed:**
- Too vague
- No language spec
- No format spec
- No examples
- No constraints

**The Fix:**
- 20-line structured prompts
- Explicit TypeScript requirement
- Code extraction pipeline
- Validation layer
- Retry mechanism

**Result:** Clean, deployable TypeScript businesses in 1 regeneration.

