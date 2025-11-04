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

    async def _execute_task_with_llm(self, task, agent_name):
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

    async def generate_business(self, spec: BusinessSpec):
        logger.info(f"Starting business generation: {spec.name}")
        start_time = time.time()
        
        dag = self._decompose_business_to_tasks(spec)
        tasks_completed = 0
        tasks_failed = 0
        components_generated = []
        errors = []
        
        for task in dag.get_all_tasks():
            if task.task_id == "root":
                continue
            result = await self._execute_task_with_llm(task, "builder_agent")
            if result.get("success"):
                tasks_completed += 1
                components_generated.append(task.task_id)
            else:
                tasks_failed += 1
                errors.append(f"Task {task.task_id} failed")
        
        spec.output_dir.mkdir(parents=True, exist_ok=True)
        manifest = {"name": spec.name, "type": spec.business_type, "generated_at": datetime.utcnow().isoformat()}
        with open(spec.output_dir / "business_manifest.json", "w") as f:
            json.dump(manifest, f, indent=2)
        
        return BusinessGenerationResult(
            business_name=spec.name, success=tasks_failed == 0,
            components_generated=components_generated, tasks_completed=tasks_completed,
            tasks_failed=tasks_failed, generation_time_seconds=time.time() - start_time,
            output_directory=str(spec.output_dir), errors=errors, metrics={"cost_usd": 0.0}
        )
