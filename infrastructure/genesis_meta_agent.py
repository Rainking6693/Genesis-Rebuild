"""Genesis Meta-Agent: Autonomous Business Generation System"""

# Auto-load .env file for configuration
from infrastructure.load_env import load_genesis_env
load_genesis_env()

import asyncio
import logging
import json
import time
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, field

from infrastructure.halo_router import HALORouter
from infrastructure.local_llm_client import get_local_llm_client
from infrastructure.task_dag import TaskDAG, Task
from prompts.agent_code_prompts import get_component_prompt, get_generic_typescript_prompt
from infrastructure.code_extractor import extract_and_validate
from infrastructure.business_monitor import get_monitor

# Modular Prompts Integration (arXiv:2510.26493 - Context Engineering 2.0)
from infrastructure.prompts import ModularPromptAssembler

logger = logging.getLogger("genesis_meta_agent")

@dataclass
class BusinessSpec:
    name: str
    business_type: str
    description: str
    components: List[str]
    output_dir: Path
    metadata: Dict[str, Any] = field(default_factory=dict)

@dataclass
class BusinessGenerationResult:
    business_name: str
    success: bool
    components_generated: List[str]
    tasks_completed: int
    tasks_failed: int
    generation_time_seconds: float
    output_directory: str
    generated_files: List[str] = field(default_factory=list)  # Added for HGM Judge
    errors: List[str] = field(default_factory=list)
    metrics: Dict[str, Any] = field(default_factory=dict)

class GenesisMetaAgent:
    def __init__(self, use_local_llm: bool = True, enable_modular_prompts: bool = True):
        self.use_local_llm = use_local_llm
        self.router = HALORouter.create_with_integrations()  # ✅ Policy Cards + Capability Maps enabled
        self.llm_client = get_local_llm_client() if use_local_llm else None
        self.business_templates = self._load_business_templates()

        # Modular Prompts Integration
        self.enable_modular_prompts = enable_modular_prompts
        if enable_modular_prompts:
            try:
                self.prompt_assembler = ModularPromptAssembler("prompts/modular")
                logger.info("✅ Modular Prompts integration enabled")
            except Exception as e:
                logger.warning(f"Modular Prompts integration failed: {e}, using fallback prompts")
                self.prompt_assembler = None
                self.enable_modular_prompts = False
        else:
            self.prompt_assembler = None

        # NEW: Intelligent component selection and team assembly
        from infrastructure.component_selector import get_component_selector
        from infrastructure.team_assembler import get_team_assembler
        from infrastructure.business_idea_generator import get_idea_generator
        
        self.component_selector = None  # Lazy load
        self.team_assembler = None  # Lazy load
        self.idea_generator = None  # Lazy load
        
        logger.info("Genesis Meta-Agent initialized")

    def _load_business_templates(self):
        # DEPRECATED: Templates are now replaced by intelligent component selection
        # Kept for backward compatibility only
        logger.warning("Using deprecated hardcoded templates. Use autonomous_generate_business() instead.")
        return {
            "ecommerce": {"components": ["product_catalog", "shopping_cart", "stripe_checkout", "email_marketing", "customer_support_bot"]},
            "content": {"components": ["blog_system", "newsletter", "seo_optimization", "social_media"]},
            "saas": {"components": ["dashboard_ui", "rest_api", "user_auth", "stripe_billing", "docs"]}
        }

    def _decompose_business_to_tasks(self, spec: BusinessSpec):
        dag = TaskDAG()
        root_task = Task(task_id="root", description=f"Generate {spec.name}", task_type="business_generation")
        dag.add_task(root_task)
        
        template = self.business_templates.get(spec.business_type, {})
        components = template.get("components", spec.components)
        
        for idx, component in enumerate(components):
            task_id = f"component_{idx}_{component}"
            task = Task(task_id=task_id, description=f"Build {component}", task_type="build_component")
            dag.add_task(task)
            dag.add_dependency(root_task.task_id, task_id)
        
        return dag

    def _execute_task_with_llm(self, task, agent_name):
        """
        Execute task using best available LLM with professional prompts and code extraction.

        Routes through HALO Router which automatically:
        1. Tries Vertex AI first (if enabled) - fine-tuned models
        2. Falls back to local LLM (Qwen 7B) - free
        3. Tracks costs and latency

        NEW: Uses modular prompts (4-file system) if enabled, otherwise fallback to legacy prompts
        """
        # Extract component name from task description
        component_name = task.description.replace("Build ", "").strip()

        # Try modular prompts first (if enabled)
        if self.enable_modular_prompts and self.prompt_assembler:
            try:
                # Assemble modular prompt for this agent
                prompt = self.prompt_assembler.assemble(
                    agent_id=agent_name,
                    task_context=f"Component: {component_name}\nBusiness Type: {getattr(self, '_current_business_type', 'generic')}",
                    variables={
                        "component_name": component_name,
                        "business_type": getattr(self, '_current_business_type', 'generic'),
                        "task_description": task.description
                    }
                )
                logger.debug(f"Using modular prompt for {agent_name} (component: {component_name})")
            except Exception as e:
                logger.warning(f"Modular prompt assembly failed for {agent_name}: {e}, using fallback")
                # Fallback to legacy prompts
                prompt = get_component_prompt(component_name, business_type=getattr(self, '_current_business_type', 'generic'))
        else:
            # Use legacy prompts
            prompt = get_component_prompt(component_name, business_type=getattr(self, '_current_business_type', 'generic'))
        
        logger.info(f"Generating {component_name} with {len(prompt)} char prompt")
        
        # Try up to 2 times with increasingly strict prompts
        max_attempts = 2
        for attempt in range(max_attempts):
            try:
                # Add extra strictness on retry
                if attempt > 0:
                    prompt = f"CRITICAL: Output ONLY TypeScript code. NO Python. NO explanations.\n\n{prompt}"
                    logger.warning(f"Retry {attempt + 1}/{max_attempts} for {component_name}")
                
                # Use HALO Router's LLM execution (Vertex AI + local fallback)
                response = self.router.execute_with_llm(
                    agent_name=agent_name,
                    prompt=prompt,
                    fallback_to_local=True,
                    max_tokens=4096,  # Increased for full components
                    temperature=0.3 if attempt == 0 else 0.1  # Lower temp on retry
                )
                
                if not response or len(response) < 50:
                    if attempt == max_attempts - 1:
                        return {"success": False, "error": "No valid response from LLM", "agent": agent_name}
                    continue
                
                # Extract and validate clean TypeScript code
                try:
                    clean_code = extract_and_validate(response, component_name)
                except ValueError as e:
                    logger.warning(f"Code extraction failed for {component_name}: {e}")
                    if attempt == max_attempts - 1:
                        return {"success": False, "error": f"Code extraction failed: {e}", "agent": agent_name}
                    continue
                
                # Success! Get cost and return
                cost = 0.0
                if self.router.use_vertex_ai and self.router.vertex_router:
                    stats = self.router.vertex_router.get_usage_stats(agent_name)
                    cost = stats.get('total_cost', 0.0)
                
                logger.info(f"✅ Generated {len(clean_code)} chars of clean TypeScript for {component_name}")
                return {
                    "success": True,
                    "result": clean_code,  # Clean TypeScript, not raw LLM output
                    "agent": agent_name,
                    "cost": cost,
                    "component": component_name
                }
                
            except Exception as e:
                logger.error(f"Attempt {attempt + 1} failed for {component_name}: {e}")
                if attempt == max_attempts - 1:
                    return {"success": False, "error": str(e), "agent": agent_name}
        
        # Should never reach here
        return {"success": False, "error": "All attempts exhausted", "agent": agent_name}

    def _write_code_to_files(self, spec: BusinessSpec, task_results: Dict[str, Dict[str, Any]]):
        """Write LLM responses to actual code files."""
        output_dir = spec.output_dir
        output_dir.mkdir(parents=True, exist_ok=True)
        
        # Create Next.js project structure
        src_dir = output_dir / "src"
        src_dir.mkdir(exist_ok=True)
        (src_dir / "app").mkdir(exist_ok=True)
        (src_dir / "components").mkdir(exist_ok=True)
        (src_dir / "lib").mkdir(exist_ok=True)
        (output_dir / "public").mkdir(exist_ok=True)
        
        # Generate package.json
        package_json = {
            "name": spec.name.lower().replace(" ", "-"),
            "version": "0.1.0",
            "private": True,
            "scripts": {
                "dev": "next dev",
                "build": "next build",
                "start": "next start",
                "lint": "next lint"
            },
            "dependencies": {
                "next": "^14.0.0",
                "react": "^18.2.0",
                "react-dom": "^18.2.0",
                "@stripe/stripe-js": "^2.0.0",
                "@stripe/react-stripe-js": "^2.0.0"
            },
            "devDependencies": {
                "@types/node": "^20.0.0",
                "@types/react": "^18.2.0",
                "@types/react-dom": "^18.2.0",
                "typescript": "^5.0.0",
                "tailwindcss": "^3.3.0",
                "autoprefixer": "^10.4.0",
                "postcss": "^8.4.0"
            }
        }
        
        with open(output_dir / "package.json", "w") as f:
            json.dump(package_json, f, indent=2)
        
        # Write LLM responses to files
        files_written = []
        for task_id, result in task_results.items():
            if result.get("success") and result.get("result"):
                code = result["result"]
                
                # Extract component name from task_id
                component_name = task_id.replace("component_", "").split("_", 1)[-1] if "_" in task_id else "component"
                
                # Write code to appropriate file
                if "package.json" in code.lower() or "dependencies" in code.lower():
                    # Package.json already written, skip
                    continue
                elif ".tsx" in code or "export default" in code or "function" in code[:100]:
                    # React component
                    file_path = src_dir / "components" / f"{component_name}.tsx"
                    with open(file_path, "w") as f:
                        f.write(code)
                    files_written.append(str(file_path))
                elif "api" in component_name.lower() or "route" in component_name.lower():
                    # API route
                    api_dir = src_dir / "app" / "api" / component_name
                    api_dir.mkdir(parents=True, exist_ok=True)
                    file_path = api_dir / "route.ts"
                    with open(file_path, "w") as f:
                        f.write(code)
                    files_written.append(str(file_path))
                else:
                    # Generic code file
                    file_path = src_dir / "lib" / f"{component_name}.ts"
                    with open(file_path, "w") as f:
                        f.write(code)
                    files_written.append(str(file_path))
        
        # Create root layout.tsx (required by Next.js 14 App Router)
        layout_file = src_dir / "app" / "layout.tsx"
        if not layout_file.exists():
            layout_content = f"""import type {{ Metadata }} from 'next'
import {{ Inter }} from 'next/font/google'
import './globals.css'

const inter = Inter({{ subsets: ['latin'] }})

export const metadata: Metadata = {{
  title: '{spec.name}',
  description: '{spec.description}',
}}

export default function RootLayout({{
  children,
}}: {{
  children: React.ReactNode
}}) {{
  return (
    <html lang="en">
      <body className={{inter.className}}>{{children}}</body>
    </html>
  )
}}
"""
            with open(layout_file, "w") as f:
                f.write(layout_content)
            files_written.append(str(layout_file))
        
        # Create globals.css (for Tailwind)
        globals_css = src_dir / "app" / "globals.css"
        if not globals_css.exists():
            with open(globals_css, "w") as f:
                f.write("@tailwind base;\n@tailwind components;\n@tailwind utilities;\n")
            files_written.append(str(globals_css))
        
        # Create basic Next.js page if no page exists
        page_file = src_dir / "app" / "page.tsx"
        if not page_file.exists():
            # Fix: Use actual values, not template strings
            page_content = f"""import {{ Metadata }} from 'next'

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
"""
            with open(page_file, "w") as f:
                f.write(page_content)
            files_written.append(str(page_file))
        
        # Create README
        readme_file = output_dir / "README.md"
        with open(readme_file, "w") as f:
            f.write(f'''# {spec.name}

{spec.description}

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

Deploy to Vercel:
```bash
vercel deploy --prod
```
''')
        
        logger.info(f"Wrote {len(files_written)} files to {output_dir}")
        return files_written

    async def generate_business(self, spec: BusinessSpec):
        logger.info(f"Starting business generation: {spec.name}")
        start_time = time.time()
        
        # Store business type for prompt generation
        self._current_business_type = spec.business_type
        
        # Start monitoring
        monitor = get_monitor()
        dag = self._decompose_business_to_tasks(spec)
        component_list = [task.description.replace("Build ", "") for task in dag.get_all_tasks() if task.task_id != "root"]
        business_id = monitor.start_business(spec.name, spec.business_type, component_list)
        tasks_completed = 0
        tasks_failed = 0
        components_generated = []
        errors = []
        task_results = {}
        total_cost = 0.0
        
        for task in dag.get_all_tasks():
            if task.task_id == "root":
                continue
            
            component_name = task.description.replace("Build ", "")
            monitor.record_component_start(business_id, component_name, "builder_agent")
            
            result = self._execute_task_with_llm(task, "builder_agent")
            task_results[task.task_id] = result
            
            if result.get("success"):
                tasks_completed += 1
                components_generated.append(task.task_id)
                cost = result.get("cost", 0.0)
                total_cost += cost
                
                # Estimate lines of code (will be accurate after file write)
                code_length = len(result.get("result", ""))
                estimated_lines = code_length // 50  # ~50 chars per line avg
                
                monitor.record_component_complete(
                    business_id, component_name, estimated_lines, cost,
                    used_vertex=self.router.use_vertex_ai
                )
            else:
                tasks_failed += 1
                error_msg = result.get('error', 'Unknown error')
                errors.append(f"Task {task.task_id} failed: {error_msg}")
                monitor.record_component_failed(business_id, component_name, error_msg)
            
            # Write dashboard snapshot after each component
            monitor.write_dashboard_snapshot()
        
        # Write code files from LLM responses
        spec.output_dir.mkdir(parents=True, exist_ok=True)
        files_written = self._write_code_to_files(spec, task_results)
        
        # Create manifest
        manifest = {
            "name": spec.name,
            "type": spec.business_type,
            "description": spec.description,
            "generated_at": datetime.utcnow().isoformat(),
            "components": components_generated,
            "files_written": files_written,
            "tasks_completed": tasks_completed,
            "tasks_failed": tasks_failed
        }
        with open(spec.output_dir / "business_manifest.json", "w") as f:
            json.dump(manifest, f, indent=2)
        
        # Complete monitoring
        monitor.complete_business(business_id, success=(tasks_failed == 0))
        monitor.write_dashboard_snapshot()
        
        return BusinessGenerationResult(
            business_name=spec.name, success=tasks_failed == 0,
            components_generated=components_generated, tasks_completed=tasks_completed,
            tasks_failed=tasks_failed, generation_time_seconds=time.time() - start_time,
            output_directory=str(spec.output_dir), generated_files=files_written,
            errors=errors, metrics={"cost_usd": total_cost}
        )
    
    async def autonomous_generate_business(
        self,
        business_idea: Optional[Any] = None,
        min_score: float = 70.0,
        max_components: int = 12,
        min_components: int = 6
    ) -> BusinessGenerationResult:
        """
        🤖 FULLY AUTONOMOUS business generation using all Genesis systems.
        
        This is the TRUE autonomous flow that replaces hardcoded templates:
        1. Generate business idea (or use provided one)
        2. Select optimal components using LLM reasoning
        3. Assemble optimal team based on capabilities
        4. Build all components in parallel
        5. Validate and learn
        
        Args:
            business_idea: Optional BusinessIdea object (if None, generates one)
            min_score: Minimum revenue score for generated ideas
            max_components: Maximum components to select
            min_components: Minimum components required
        
        Returns:
            BusinessGenerationResult with all components built
        """
        logger.info("="*80)
        logger.info("🤖 STARTING FULLY AUTONOMOUS BUSINESS GENERATION")
        logger.info("="*80)
        
        # Lazy load dependencies
        if self.idea_generator is None:
            from infrastructure.business_idea_generator import get_idea_generator
            self.idea_generator = get_idea_generator()
        
        if self.component_selector is None:
            from infrastructure.component_selector import get_component_selector
            self.component_selector = get_component_selector()
        
        if self.team_assembler is None:
            from infrastructure.team_assembler import get_team_assembler
            self.team_assembler = get_team_assembler()
        
        # Step 1: Generate or use business idea
        if business_idea is None:
            logger.info("🎯 Step 1: Generating business idea...")
            idea = await self.idea_generator.generate_idea(min_revenue_score=min_score)
            logger.info(f"✅ Generated: '{idea.name}' (score={idea.overall_score:.1f}/100)")
        else:
            idea = business_idea
            logger.info(f"🎯 Step 1: Using provided idea: '{idea.name}'")
        
        # Step 2: Select optimal components using LLM
        logger.info(f"🧩 Step 2: Intelligently selecting components...")
        selection = await self.component_selector.select_components_for_business(
            business_idea=idea,
            max_components=max_components,
            min_components=min_components
        )
        
        components = selection.components
        logger.info(f"✅ Selected {len(components)} components (build time: {selection.total_build_time_minutes}min)")
        logger.info(f"   Components: {components}")
        logger.info(f"   Reasoning: {selection.reasoning}")
        
        # Step 3: Assemble optimal team
        logger.info(f"👥 Step 3: Assembling optimal team...")
        team_agent_ids = self.team_assembler.assemble_optimal_team(
            components=components,
            business_type=idea.business_type,
            team_size=5
        )
        
        logger.info(f"✅ Team assembled: {team_agent_ids}")
        
        # Step 4: Create business spec with selected components
        business_name_slug = idea.name.lower().replace(' ', '-').replace("'", "")
        output_dir = Path(f"businesses/autonomous/{business_name_slug}")
        
        spec = BusinessSpec(
            name=idea.name,
            business_type=idea.business_type,
            description=idea.description,
            components=components,  # ✅ Uses intelligently selected components
            output_dir=output_dir,
            metadata={
                **idea.to_dict(),
                "component_selection": {
                    "total_components": len(components),
                    "required": selection.required_count,
                    "recommended": selection.recommended_count,
                    "build_time_minutes": selection.total_build_time_minutes
                },
                "team": team_agent_ids
            }
        )
        
        # Step 5: Generate business using standard flow
        logger.info(f"🔨 Step 4: Building {len(components)} components...")
        logger.info(f"   Using team: {team_agent_ids}")
        
        result = await self.generate_business(spec)
        
        # Step 6: Log success
        if result.success:
            logger.info("="*80)
            logger.info(f"✅ AUTONOMOUS GENERATION COMPLETE: {idea.name}")
            logger.info(f"   Components: {len(components)} built successfully")
            logger.info(f"   Time: {result.generation_time_seconds:.1f}s")
            logger.info(f"   Output: {result.output_directory}")
            logger.info("="*80)
        else:
            logger.error(f"❌ Generation failed: {result.errors}")
        
        return result
