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
from typing import Dict, List, Any
from dataclasses import dataclass, field

from infrastructure.halo_router import HALORouter
from infrastructure.local_llm_client import get_local_llm_client
from infrastructure.task_dag import TaskDAG, Task

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
    errors: List[str] = field(default_factory=list)
    metrics: Dict[str, Any] = field(default_factory=dict)

class GenesisMetaAgent:
    def __init__(self, use_local_llm: bool = True):
        self.use_local_llm = use_local_llm
        self.router = HALORouter()
        self.llm_client = get_local_llm_client() if use_local_llm else None
        self.business_templates = self._load_business_templates()
        logger.info("Genesis Meta-Agent initialized")

    def _load_business_templates(self):
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
        Execute task using best available LLM (Vertex AI or local)
        
        Routes through HALO Router which automatically:
        1. Tries Vertex AI first (if enabled) - fine-tuned models
        2. Falls back to local LLM (Qwen 7B) - free
        3. Tracks costs and latency
        """
        prompt = f"You are {agent_name}. Task: {task.description}. Generate production code."
        
        try:
            # Use HALO Router's LLM execution (Vertex AI + local fallback)
            response = self.router.execute_with_llm(
                agent_name=agent_name,
                prompt=prompt,
                fallback_to_local=True,
                max_tokens=2048,
                temperature=0.7
            )
            
            if response:
                # Check if response is an error message (not real code)
                if response.startswith("ERROR:") or response.startswith("# ") or len(response) < 50:
                    logger.error(f"LLM returned invalid response for {agent_name}: {response[:100]}")
                    return {"success": False, "error": f"Invalid LLM response: {response[:100]}", "agent": agent_name}
                
                # Get cost from Vertex AI if used
                cost = 0.0
                if self.router.use_vertex_ai and self.router.vertex_router:
                    stats = self.router.vertex_router.get_usage_stats(agent_name)
                    cost = stats.get('total_cost', 0.0)
                
                return {"success": True, "result": response, "agent": agent_name, "cost": cost}
            else:
                return {"success": False, "error": "No response from LLM", "agent": agent_name}
                
        except Exception as e:
            return {"success": False, "error": str(e), "agent": agent_name}

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
        
        # Create basic Next.js page if no page exists
        page_file = src_dir / "app" / "page.tsx"
        if not page_file.exists():
            with open(page_file, "w") as f:
                f.write(f'''import {{ Metadata }} from 'next'

export const metadata: Metadata = {{
  title: '{spec.name}',
  description: '{spec.description}',
}}

export default function Home() {{
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">{{'{'}}{spec.name}{{'}'}}</h1>
      <p className="mt-4 text-lg">{{'{'}}{spec.description}{{'}'}}</p>
    </main>
  )
}}
''')
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
        
        dag = self._decompose_business_to_tasks(spec)
        tasks_completed = 0
        tasks_failed = 0
        components_generated = []
        errors = []
        task_results = {}
        total_cost = 0.0
        
        for task in dag.get_all_tasks():
            if task.task_id == "root":
                continue
            result = self._execute_task_with_llm(task, "builder_agent")
            task_results[task.task_id] = result
            
            if result.get("success"):
                tasks_completed += 1
                components_generated.append(task.task_id)
                total_cost += result.get("cost", 0.0)
            else:
                tasks_failed += 1
                errors.append(f"Task {task.task_id} failed: {result.get('error', 'Unknown error')}")
        
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
        
        return BusinessGenerationResult(
            business_name=spec.name, success=tasks_failed == 0,
            components_generated=components_generated, tasks_completed=tasks_completed,
            tasks_failed=tasks_failed, generation_time_seconds=time.time() - start_time,
            output_directory=str(spec.output_dir), errors=errors, metrics={"cost_usd": total_cost}
        )
