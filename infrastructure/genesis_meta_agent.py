"""Genesis Meta-Agent: Autonomous Business Generation System"""

# Auto-load .env file for configuration
from infrastructure.load_env import load_genesis_env
load_genesis_env()

import asyncio
import logging
import json
import os
import re
import time
from datetime import datetime, timezone, date
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple, TYPE_CHECKING
from dataclasses import dataclass, field

from infrastructure.halo_router import HALORouter
from infrastructure.local_llm_client import get_local_llm_client
from infrastructure.task_dag import TaskDAG, Task
from infrastructure.component_library import COMPONENT_LIBRARY
from infrastructure.payments.agent_base import PaymentAgentBase
from infrastructure.payment_intent_manager import PaymentIntentManager

# Try to import prompts, provide fallbacks if not available
try:
    from prompts.agent_code_prompts import get_component_prompt, get_generic_typescript_prompt
except ImportError:
    # Fallback: simple prompt generators
    def get_component_prompt(component_name: str, business_type: str = "generic") -> str:
        return f"""Generate a {component_name} component for a {business_type} business.

Requirements:
- Clean, production-ready code
- Proper error handling
- TypeScript with type safety
- Modern React patterns (hooks, functional components)
- Responsive design

Component: {component_name}
Business Type: {business_type}

Generate the complete component code:"""

    def get_generic_typescript_prompt() -> str:
        return """Generate clean, production-ready TypeScript/React code following best practices."""

from collections import defaultdict
from uuid import uuid4

from infrastructure.code_extractor import extract_and_validate
from infrastructure.business_monitor import get_monitor
from infrastructure.workspace_state_manager import WorkspaceStateManager

if TYPE_CHECKING:
    from infrastructure.genesis_discord import GenesisDiscord

try:
    from agents.reflection_agent import get_reflection_agent  # type: ignore
    HAS_REFLECTION_AGENT = True
except ImportError:  # pragma: no cover
    HAS_REFLECTION_AGENT = False
    get_reflection_agent = None

# Modular Prompts Integration (arXiv:2510.26493 - Context Engineering 2.0)
try:
    from infrastructure.prompts import ModularPromptAssembler
except ImportError:
    # Fallback: simple prompt assembler
    class ModularPromptAssembler:
        def __init__(self, prompts_dir: str):
            self.prompts_dir = prompts_dir

        def assemble(self, *args, **kwargs) -> str:
            return "Generate code according to requirements."

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

COMPONENT_CATEGORY_AGENT_MAP = {
    "marketing": "marketing_agent",
    "content": "content_agent",
    "payment": "billing_agent",
    "support": "support_agent",
    "analytics": "analyst_agent",
    "security": "security_agent",
    "documentation": "content_agent",
    "devops": "deploy_agent",
    "agent_infrastructure": "monitoring_agent",
    "advanced": "qa_agent",
    "saas": "backend_agent",
    "commerce": "frontend_agent",
}

COMPONENT_KEYWORD_AGENT_MAP = {
    "newsletter": "marketing_agent",
    "seo": "marketing_agent",
    "email": "marketing_agent",
    "social": "marketing_agent",
    "campaign": "marketing_agent",
    "stripe": "billing_agent",
    "billing": "billing_agent",
    "invoice": "billing_agent",
    "payment": "billing_agent",
    "support": "support_agent",
    "ticket": "support_agent",
    "analytics": "analyst_agent",
    "report": "analyst_agent",
    "insight": "analyst_agent",
    "security": "security_agent",
    "auth": "security_agent",
    "sso": "security_agent",
    "encrypt": "security_agent",
    "docs": "content_agent",
    "documentation": "content_agent",
    "knowledge": "content_agent",
    "legal": "legal_agent",
    "policy": "legal_agent",
    "compliance": "legal_agent",
    "deploy": "deploy_agent",
    "infrastructure": "deploy_agent",
    "monitor": "monitoring_agent",
    "alert": "monitoring_agent",
    "finance": "finance_agent",
    "pricing": "finance_agent",
    "budget": "finance_agent",
    "sales": "sales_agent",
    "crm": "sales_agent",
    "lead": "sales_agent",
    "research": "research_agent",
    "competitive": "research_agent",
    "experiment": "qa_agent",
    "test": "qa_agent",
    "ui": "frontend_agent",
    "frontend": "frontend_agent",
    "api": "backend_agent",
    "service": "backend_agent",
}

SPEND_SUMMARY_LOG = Path("data/a2a-x402/spend_summaries.jsonl")
DEFAULT_DAILY_BUDGET_USD = float(os.getenv("META_AGENT_DEFAULT_DAILY_BUDGET", "500.0"))
AGENT_DAILY_BUDGETS: Dict[str, float] = {
    "builder_agent": 600.0,
    "deploy_agent": 400.0,
    "qa_agent": 250.0,
    "marketing_agent": 300.0,
    "support_agent": 250.0,
    "finance_agent": 350.0,
    "research_agent": 280.0,
    "billing_agent": 320.0,
    "analyst_agent": 280.0,
    "monitoring_agent": 220.0,
}
VENDOR_WHITELIST = {
    "payments:builder_agent",
    "payments:deploy_agent",
    "payments:qa_agent",
    "payments:marketing_agent",
    "payments:support_agent",
    "payments:finance_agent",
    "payments:research_agent",
    "payments:billing_agent",
    "payments:analyst_agent",
    "payments:monitoring_agent",
}
FRAUD_PATTERNS = ["urgent transfer", "wire request", "override budget", "suspicious vendor"]

AGENT_COMPONENT_REQUIREMENTS = {
    "frontend_agent": "dashboard_ui",
    "backend_agent": "rest_api",
    "security_agent": "role_permissions",
    "qa_agent": "a/b_testing",
    "analytics_agent": "usage_analytics",
    "marketing_agent": "email_marketing",
    "content_agent": "blog_system",
    "billing_agent": "stripe_billing",
    "support_agent": "customer_support_bot",
    "deploy_agent": "backup_system",
    "monitoring_agent": "error_tracking",
    "finance_agent": "subscription_management",
    "sales_agent": "referral_system",
    "research_agent": "reporting_engine",
    "spec_agent": "docs",
    "architect_agent": "feature_flags",
    "legal_agent": "audit_logs",
}

class GenesisMetaAgent:
    def __init__(
        self,
        use_local_llm: bool = True,
        enable_modular_prompts: bool = True,
        enable_memory: bool = True,
        discord_client: Optional["GenesisDiscord"] = None,
    ):
        self.use_local_llm = use_local_llm
        self.router = HALORouter.create_with_integrations()  # ✅ Policy Cards + Capability Maps enabled
        self.llm_client = get_local_llm_client() if use_local_llm else None
        self.business_templates = self._load_business_templates()
        self.discord = discord_client
        self.payment_manager = PaymentIntentManager()

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

        # NEW: Memory Integration (Tier 1 - Critical)
        self.enable_memory = enable_memory
        self.memory_integration = None
        if enable_memory:
            try:
                from infrastructure.genesis_memory_integration import GenesisMemoryIntegration
                self.memory_integration = GenesisMemoryIntegration(
                    mongodb_uri=os.getenv("MONGODB_URI"),
                    gemini_api_key=os.getenv("GEMINI_API_KEY"),
                    session_ttl_hours=24
                )
                logger.info("✅ Memory integration enabled (MongoDB + Gemini multimodal)")
            except Exception as e:
                logger.warning(f"Memory integration failed: {e}, running without persistent memory")
                self.memory_integration = None
                self.enable_memory = False
        else:
            logger.info("Memory integration disabled")

        # NEW: Intelligent component selection and team assembly
        from infrastructure.component_selector import get_component_selector
        from infrastructure.team_assembler import get_team_assembler
        from infrastructure.business_idea_generator import get_idea_generator

        self.component_selector = None  # Lazy load
        self.team_assembler = None  # Lazy load
        self.idea_generator = None  # Lazy load

        self.reflection_agent = None
        if HAS_REFLECTION_AGENT:
            try:
                self.reflection_agent = get_reflection_agent()
                logger.info("✅ Reflection agent middleware enabled")
            except Exception as exc:
                logger.warning(f"Reflection agent unavailable: {exc}")
                self.reflection_agent = None

        self._darwin_enabled = os.getenv("ENABLE_DARWIN_WRAP", "true").lower() != "false"
        self._current_team_agents: List[str] = []
        self._current_spec: Optional[BusinessSpec] = None
        self._current_business_id: Optional[str] = None
        self.payment_base = PaymentAgentBase("genesis_meta_agent", cost_map={
            "call_premium_llm": 1.5,
            "optimize_prompt": 0.4
        })
        self._daily_spend: Dict[str, Dict[str, Any]] = {}
        self._daily_budget_limits: Dict[str, float] = self._load_daily_budget_limits()
        self._flagged_mandates = {
            mandate.strip()
            for mandate in os.getenv("META_AGENT_FLAGGED_MANDATES", "").split(",")
            if mandate.strip()
        }
        self._vendor_whitelist = {vendor.lower() for vendor in VENDOR_WHITELIST}
        self._fraud_patterns = FRAUD_PATTERNS

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

    def _load_daily_budget_limits(self) -> Dict[str, float]:
        limits = dict(AGENT_DAILY_BUDGETS)
        env_value = os.getenv("META_AGENT_DAILY_LIMITS", "")
        if env_value:
            for token in env_value.split(","):
                if "=" not in token:
                    continue
                agent_name, limit_value = token.split("=", 1)
                try:
                    limits[agent_name.strip()] = float(limit_value.strip())
                except ValueError:
                    logger.warning(f"Ignoring invalid budget limit for {agent_name}: {limit_value}")
        return limits

    def _ensure_daily_record(self, agent_id: str) -> Dict[str, Any]:
        today = datetime.now(timezone.utc).date()
        record = self._daily_spend.get(agent_id)
        if not record or record.get("date") != today:
            record = {"date": today, "spent": 0.0}
            self._daily_spend[agent_id] = record
        return record

    def _is_fraudulent(self, reason: str, mandate_id: str) -> bool:
        lower_reason = (reason or "").lower()
        if mandate_id and mandate_id in self._flagged_mandates:
            return True
        return any(pattern in lower_reason for pattern in self._fraud_patterns)

    def _record_daily_spend(self, agent_id: str, amount_usd: float) -> None:
        record = self._ensure_daily_record(agent_id)
        record["spent"] += amount_usd

    async def approve_payment_intent(
        self,
        agent_id: str,
        vendor: str,
        amount_cents: int,
        reason: str,
        mandate_id: str,
    ) -> Tuple[bool, str]:
        amount_usd = amount_cents / 100.0
        vendor_key = (vendor or "").lower()
        record = self._ensure_daily_record(agent_id)
        daily_limit = self._daily_budget_limits.get(agent_id, DEFAULT_DAILY_BUDGET_USD)

        if amount_usd < 10.0:
            return True, "Auto-approved (amount below $10 threshold)"

        if vendor_key and vendor_key not in self._vendor_whitelist:
            return False, f"Vendor {vendor_key} is not whitelisted"

        if self._is_fraudulent(reason, mandate_id):
            return False, "Denied: fraud pattern detected"

        if record["spent"] + amount_usd > daily_limit:
            return False, f"Daily budget ${daily_limit:.2f} exceeded"

        return True, "Approved within Meta Agent policy"

    def _decompose_business_to_tasks(self, spec: BusinessSpec):
        dag = TaskDAG()
        root_task = Task(task_id="root", description=f"Generate {spec.name}", task_type="business_generation")
        dag.add_task(root_task)
        
        template = self.business_templates.get(spec.business_type, {})
        components = spec.components or template.get("components", [])
        
        for idx, component in enumerate(components):
            task_id = f"component_{idx}_{component}"
            task = Task(task_id=task_id, description=f"Build {component}", task_type="build_component")
            dag.add_task(task)
            dag.add_dependency(root_task.task_id, task_id)
        
        return dag

    def _build_component_prompt(self, agent_name: str, component_name: str, business_type: str, task_description: str) -> str:
        """Assemble prompts using modular system when available."""
        if self.enable_modular_prompts and self.prompt_assembler:
            try:
                prompt = self.prompt_assembler.assemble(
                    agent_id=agent_name,
                    task_context=f"Component: {component_name}\nBusiness Type: {business_type}",
                    variables={
                        "component_name": component_name,
                        "business_type": business_type,
                        "task_description": task_description,
                    },
                )
                return prompt
            except Exception as exc:
                logger.warning(f"Modular prompt assembly failed for {agent_name}: {exc}")
        return get_component_prompt(component_name, business_type=business_type)

    async def _call_router(self, agent_name: str, prompt: str, temperature: float) -> Optional[str]:
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(
            None,
            lambda: self.router.execute_with_llm(
                agent_name=agent_name,
                prompt=prompt,
                fallback_to_local=True,
                max_tokens=4096,
                temperature=temperature,
            ),
        )

    async def _extract_code_async(self, response: str, component_name: str) -> str:
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(None, lambda: extract_and_validate(response, component_name))

    async def _maybe_refine_with_darwin(self, component_name: str, code: str, business_type: str) -> str:
        if not self._darwin_enabled:
            return code
        prompt = (
            "You are the SE-Darwin self-improvement agent. Improve the following "
            f"{component_name} component for a {business_type} business. Focus on resiliency, "
            "edge cases, accessibility, and maintainability. Respond with TypeScript code only.\n\n"
            f"{code}"
        )
        try:
            refined = await self._call_router("darwin_agent", prompt, temperature=0.15)
            if refined:
                return await self._extract_code_async(refined, f"{component_name}_darwin")
        except Exception as exc:
            logger.debug(f"Darwin refinement skipped for {component_name}: {exc}")
        return code

    async def _maybe_reflect_component(
        self,
        component_name: str,
        agent_name: str,
        code: str,
        business_type: str,
    ):
        if not hasattr(self, "reflection_agent") or not self.reflection_agent:
            return None
        try:
            return await self.reflection_agent.reflect(
                content=code,
                content_type="code",
                context={
                    "component": component_name,
                    "agent": agent_name,
                    "business_type": business_type,
                },
            )
        except Exception as exc:
            logger.warning(f"Reflection failed for {component_name}: {exc}")
            return None

    async def _refine_with_genesis(
        self,
        component_name: str,
        initial_code: str,
        agent_used: str,
        business_type: str,
    ) -> Tuple[str, Optional[Dict[str, Any]]]:
        """
        Ask the Genesis agent to review and refine specialist output using full business context.
        """
        if not self._current_spec:
            return initial_code, None

        spec = self._current_spec
        prompt = (
            "You are Genesis, the master orchestrator overseeing all 53 systems.\n\n"
            f"Business Context:\n"
            f"- Name: {spec.name}\n"
            f"- Type: {spec.business_type}\n"
            f"- Description: {spec.description}\n\n"
            f"Component: {component_name}\n"
            f"Generated by: {agent_used}\n\n"
            "Original Code:\n"
            "```typescript\n"
            f"{initial_code}\n"
            "```\n\n"
            "Review this code and apply SE-Darwin refinement:\n"
            "1. Check correctness, completeness, and quality\n"
            "2. Ensure consistency with business context\n"
            "3. Apply security best practices\n"
            "4. Optimize performance\n"
            "5. Improve maintainability\n\n"
            "Output ONLY the refined TypeScript code."
        )

        try:
            response = await self._call_router("genesis_agent", prompt, temperature=0.1)
        except Exception as exc:
            logger.warning(f"Genesis refinement failed for {component_name}: {exc}")
            return initial_code, None

        if not response or len(response) < 40:
            return initial_code, None

        try:
            refined = await self._extract_code_async(response, f"{component_name}_genesis")
        except ValueError as exc:
            logger.warning(f"Genesis produced invalid code for {component_name}: {exc}")
            return initial_code, None

        refined = await self._maybe_refine_with_darwin(component_name, refined, spec.business_type)
        reflection = await self._maybe_reflect_component(
            component_name=component_name,
            agent_name="genesis_agent",
            code=refined,
            business_type=spec.business_type,
        )
        return refined, self._serialize_reflection(reflection)

    def _augment_prompt_with_feedback(self, base_prompt: str, feedback: str, suggestions: List[str]) -> str:
        suggestion_block = "\n".join(f"- {s}" for s in suggestions[:5]) if suggestions else ""
        feedback_block = feedback or "Reflection detected issues. Address them carefully."
        return (
            f"{base_prompt}\n\n"
            "## Reflection Feedback\n"
            f"{feedback_block}\n"
            f"{suggestion_block}\n\n"
            "Regenerate the component and ensure all issues are resolved. Output ONLY TypeScript code."
        )

    def _serialize_reflection(self, reflection_result) -> Optional[Dict[str, Any]]:
        if not reflection_result:
            return None
        return {
            "overall_score": reflection_result.overall_score,
            "passes_threshold": reflection_result.passes_threshold,
            "summary": reflection_result.summary_feedback,
            "suggestions": reflection_result.suggestions,
            "timestamp": reflection_result.timestamp,
        }

    def _select_agent_for_component(self, component_name: str) -> str:
        info = COMPONENT_LIBRARY.get(component_name, {})
        category = info.get("category")

        # Direct mapping from practice components to agents
        for agent, required_component in AGENT_COMPONENT_REQUIREMENTS.items():
            if component_name == required_component:
                mapped_agent = agent
                if mapped_agent == "analytics_agent":
                    registry = getattr(self.router, "agent_registry", None)
                    if registry is None and hasattr(self.router, "halo_router"):
                        registry = getattr(self.router.halo_router, "agent_registry", None)
                    if registry is not None and "analytics_agent" not in registry and "analyst_agent" in registry:
                        mapped_agent = "analyst_agent"
                return mapped_agent

        agent = COMPONENT_CATEGORY_AGENT_MAP.get(category)

        lower_name = component_name.lower()
        if not agent:
            for keyword, mapped_agent in COMPONENT_KEYWORD_AGENT_MAP.items():
                if keyword in lower_name:
                    agent = mapped_agent
                    break

        agent = agent or "builder_agent"
        if self._current_team_agents is not None and agent not in self._current_team_agents:
            self._current_team_agents.append(agent)
        return agent

    def _component_vendor(self, agent_name: str) -> str:
        return f"payments:{agent_name}"

    def _ensure_agent_coverage(
        self,
        components: List[str],
        max_components: Optional[int] = None,
    ) -> List[str]:
        """Ensure every core specialist agent has at least one component to work on, without exceeding caps."""
        ensured = list(components)
        present = set(ensured)
        additions: List[str] = []
        skipped: List[str] = []
        for required_component in AGENT_COMPONENT_REQUIREMENTS.values():
            if required_component not in present:
                if max_components is not None and len(ensured) >= max_components:
                    skipped.append(required_component)
                    continue
                ensured.append(required_component)
                present.add(required_component)
                additions.append(required_component)
        if additions:
            logger.info(
                "Added practice components for specialist coverage: %s",
                ", ".join(additions),
            )
        if skipped:
            logger.debug(
                "Skipped adding practice components due to max component cap: %s",
                ", ".join(skipped),
            )
        return ensured

    async def _execute_task_with_llm(self, task, agent_name, allow_builder_fallback: bool = True):
        """Execute a task with HALO routing, SE-Darwin refinement, and reflection QA."""
        component_name = task.description.replace("Build ", "").strip()
        business_type = getattr(self, "_current_business_type", "generic")

        prompt = self._build_component_prompt(
            agent_name=agent_name,
            component_name=component_name,
            business_type=business_type,
            task_description=task.description,
        )
        base_prompt = prompt
        temperatures = [0.3, 0.15]
        last_error = None

        for attempt, temperature in enumerate(temperatures, start=1):
            current_prompt = prompt
            if attempt > 1 and current_prompt == base_prompt:
                current_prompt = (
                    "CRITICAL: Output ONLY valid TypeScript component code. "
                    "Do NOT include markdown fences, explanations, or JSON.\n\n"
                    f"{base_prompt}"
                )
            try:
                response = await self._call_router(
                    agent_name=agent_name,
                    prompt=current_prompt,
                    temperature=temperature,
                )
            except Exception as exc:
                logger.warning(f"{agent_name} routing error (attempt {attempt}): {exc}")
                last_error = str(exc)
                continue

            if not response or len(response) < 40:
                last_error = "Empty response"
                continue

            try:
                code = await self._extract_code_async(response, component_name)
            except ValueError as exc:
                last_error = str(exc)
                continue

            code, reflection_payload = await self._refine_with_genesis(
                component_name=component_name,
                initial_code=code,
                agent_used=agent_name,
                business_type=business_type,
            )

            if reflection_payload is None:
                code = await self._maybe_refine_with_darwin(component_name, code, business_type)
                reflection_result = await self._maybe_reflect_component(
                    component_name=component_name,
                    agent_name=agent_name,
                    code=code,
                    business_type=business_type,
                )

                if reflection_result and not reflection_result.passes_threshold:
                    logger.warning(
                        f"Reflection failed for {component_name} (score={reflection_result.overall_score:.2f})"
                    )
                    prompt = self._augment_prompt_with_feedback(
                        base_prompt,
                        reflection_result.summary_feedback,
                        reflection_result.suggestions,
                    )
                    last_error = "Reflection feedback applied"
                    continue
                reflection_payload = self._serialize_reflection(reflection_result)

            return {
                "success": True,
                "result": code,
                "raw_response": response,
                "component": component_name,
                "agent": agent_name,
                "reflection": reflection_payload,
                "cost": 0.0,
            }

        failure_payload = {
            "success": False,
            "error": last_error or "Generation failed",
            "agent": agent_name,
            "component": component_name,
        }

        if allow_builder_fallback and agent_name != "builder_agent":
            logger.info(f"Falling back to builder_agent for {component_name}")
            return await self._execute_task_with_llm(task, "builder_agent", allow_builder_fallback=False)

        return failure_payload

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
                safe_component_name = re.sub(r"[^a-zA-Z0-9_]+", "_", component_name).strip("_")
                if not safe_component_name:
                    safe_component_name = "component"
                
                # Write code to appropriate file
                if "package.json" in code.lower() or "dependencies" in code.lower():
                    # Package.json already written, skip
                    continue
                elif ".tsx" in code or "export default" in code or "function" in code[:100]:
                    # React component
                    file_path = src_dir / "components" / f"{safe_component_name}.tsx"
                    with open(file_path, "w") as f:
                        f.write(code)
                    files_written.append(str(file_path))
                elif "api" in component_name.lower() or "route" in component_name.lower():
                    # API route
                    api_dir = src_dir / "app" / "api" / safe_component_name
                    api_dir.mkdir(parents=True, exist_ok=True)
                    file_path = api_dir / "route.ts"
                    with open(file_path, "w") as f:
                        f.write(code)
                    files_written.append(str(file_path))
                else:
                    # Generic code file
                    file_path = src_dir / "lib" / f"{safe_component_name}.ts"
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
        
        # Store business context for downstream agents
        coverage_target = max(len(spec.components) + len(AGENT_COMPONENT_REQUIREMENTS), len(AGENT_COMPONENT_REQUIREMENTS))
        spec.components = self._ensure_agent_coverage(
            spec.components,
            max_components=coverage_target,
        )
        self._current_spec = spec
        self._current_business_type = spec.business_type
        self._current_team_agents = list(spec.metadata.get("team", []))
        
        # Start monitoring
        monitor = get_monitor()
        dag = self._decompose_business_to_tasks(spec)
        component_list = [task.description.replace("Build ", "") for task in dag.get_all_tasks() if task.task_id != "root"]
        business_id = monitor.start_business(spec.name, spec.business_type, component_list)
        spec.metadata.setdefault("business_id", business_id)
        self._current_business_id = business_id
        if self.discord:
            await self.discord.business_build_started(business_id, spec.name, spec.description)
        workspace_manager = self._create_workspace_manager(business_id, spec)
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
            component_agent = self._select_agent_for_component(component_name)
            monitor.record_component_start(business_id, component_name, component_agent)

            if self.discord:
                await self.discord.agent_started(business_id, component_agent, component_name)

            try:
                result = await self._execute_task_with_llm(task, component_agent)
            except Exception as exc:
                if self.discord:
                    await self.discord.agent_error(business_id, component_agent, str(exc))
                raise
            task_results[task.task_id] = result
            
            success = result.get("success")
            cost = float(result.get("cost", 0.0))
            latency_ms = result.get("latency_ms") or result.get("latency")
            intent = None
            if success:
                metadata = {
                    **self._current_spec.metadata,
                    "target_agent": component_agent,
                    "component": component_name,
                    "vendor": self._component_vendor(component_agent),
                }
                metadata.setdefault("business_id", business_id)
                metadata.setdefault("mandate_id", f"{business_id}-{component_name}")
                amount_cents = int(cost * 100)
                mandate_id = metadata.get("mandate_id")
                approved, approval_reason = await self.approve_payment_intent(
                    component_agent,
                    metadata.get("vendor", ""),
                    amount_cents,
                    reason="Component generation complete",
                    mandate_id=mandate_id or f"{business_id}-{component_name}",
                )
                metadata["approval_reason"] = approval_reason
                intent = self.payment_manager.evaluate(
                    component_agent,
                    component_name,
                    cost,
                    metadata=metadata,
                    override_approved=approved,
                    override_reason=approval_reason,
                )
                if not intent.approved:
                    tasks_failed += 1
                    error_msg = f"Payment denied: {intent.reason}"
                    errors.append(error_msg)
                    monitor.record_component_failed(business_id, component_name, error_msg)
                    if self.discord:
                        await self.discord.agent_error(business_id, component_agent, error_msg)
                    continue
                tasks_completed += 1
                components_generated.append(task.task_id)
                total_cost += cost
                
                # Estimate lines of code (will be accurate after file write)
                code_length = len(result.get("result", ""))
                estimated_lines = code_length // 50  # ~50 chars per line avg
                
                monitor.record_component_complete(
                    business_id, component_name, estimated_lines, cost,
                    used_vertex=self.router.use_vertex_ai
                )
                self._record_daily_spend(component_agent, cost)
            else:
                tasks_failed += 1
                error_msg = result.get('error', 'Unknown error')
                errors.append(f"Task {task.task_id} failed: {error_msg}")
                monitor.record_component_failed(business_id, component_name, error_msg)
                if self.discord:
                    await self.discord.agent_error(business_id, component_agent, error_msg)

            if success and intent and intent.approved and self.discord:
                summary = result.get("summary") or result.get("result", "")
                summary = summary[:280] if summary else "Component completed."
                await self.discord.agent_completed(business_id, component_agent, summary)

            event_payload = {
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "task_id": task.task_id,
                "component": component_name,
                "agent": component_agent,
                "status": "success" if success else "failure",
                "cost": cost,
                "latency_ms": latency_ms,
                "error": result.get("error"),
                "tasks_completed": tasks_completed,
                "tasks_failed": tasks_failed,
                "total_cost": total_cost,
                "notes": result.get("notes"),
                "payment_intent": intent.to_dict() if intent else None,
            }
            await workspace_manager.record_event(event_payload)
            
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
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "components": components_generated,
            "files_written": files_written,
            "tasks_completed": tasks_completed,
            "tasks_failed": tasks_failed
        }
        with open(spec.output_dir / "business_manifest.json", "w") as f:
            json.dump(manifest, f, indent=2)
        
        # Complete monitoring
        monitor.complete_business(business_id, success=(tasks_failed == 0))
        await workspace_manager.finalize()
        monitor.write_dashboard_snapshot()

        await self._summarize_business_spend(business_id, spec, total_cost)
        
        self._current_team_agents = []

        result_obj = BusinessGenerationResult(
            business_name=spec.name, success=tasks_failed == 0,
            components_generated=components_generated, tasks_completed=tasks_completed,
            tasks_failed=tasks_failed, generation_time_seconds=time.time() - start_time,
            output_directory=str(spec.output_dir), generated_files=files_written,
            errors=errors, metrics={"cost_usd": total_cost}
        )
        self._current_spec = None
        self._current_business_id = None

        if self.discord:
            build_metrics = {
                "name": spec.name,
                "quality_score": spec.metadata.get("quality_score", 0),
                "build_time": f"{result_obj.generation_time_seconds:.1f}s",
            }
            deployment_url = spec.metadata.get("deployment_url", "Deployment pending")
            await self.discord.business_build_completed(business_id, deployment_url, build_metrics)

        return result_obj

    async def _summarize_business_spend(self, business_id: str, spec: BusinessSpec, total_cost: float):
        intents = self.payment_manager.get_business_intents(business_id)
        vendor_breakdown: Dict[str, float] = defaultdict(float)
        agent_breakdown: Dict[str, float] = defaultdict(float)
        approved = 0
        denied = 0
        for intent in intents:
            vendor = intent.metadata.get("vendor") or intent.component
            vendor_breakdown[vendor] += intent.cost_usd
            agent_breakdown[intent.agent] += intent.cost_usd
            if intent.approved:
                approved += 1
            else:
                denied += 1
        projected_revenue = float(spec.metadata.get("projected_revenue") or spec.metadata.get("target_revenue") or 0.0)
        ratio = round((total_cost / projected_revenue), 3) if projected_revenue else None
        roi = round((projected_revenue / total_cost), 3) if total_cost and projected_revenue else None
        summary = {
            "business_id": business_id,
            "business_name": spec.name,
            "total_spent": round(total_cost, 2),
            "approved_intents": approved,
            "denied_intents": denied,
            "vendor_breakdown": vendor_breakdown,
            "agent_breakdown": agent_breakdown,
            "projected_revenue": projected_revenue,
            "spend_to_revenue_ratio": ratio,
            "roi": roi,
            "dashboard_url": spec.metadata.get("deployment_url") or spec.metadata.get("dashboard_url"),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        self._write_spend_summary(summary)
        await self.post_business_spend_summary(summary)

    def _write_spend_summary(self, summary: Dict[str, Any]) -> None:
        SPEND_SUMMARY_LOG.parent.mkdir(parents=True, exist_ok=True)
        with SPEND_SUMMARY_LOG.open("a", encoding="utf-8") as fd:
            fd.write(json.dumps(summary) + "\n")

    async def post_business_spend_summary(self, summary: Dict[str, Any]) -> None:
        message = self._format_spend_summary_message(summary)
        await self._send_discord_message("dashboard", message, business_id=summary.get("business_id"))
        if self.discord:
            await self.discord.payment_business_summary(summary)

    async def _send_discord_message(
        self,
        channel: str,
        message: str,
        business_id: Optional[str] = None,
    ) -> None:
        if not self.discord:
            return
        target_business = business_id or self._current_business_id or "meta-agent"
        if channel == "dashboard":
            await self.discord.agent_progress(target_business, "Meta Agent Summary", message)
        else:
            await self.discord.agent_error(target_business, "Meta Agent Summary", message)

    def _format_spend_summary_message(self, summary: Dict[str, Any]) -> str:
        lines = [
            f"💰 Total Spent: ${summary.get('total_spent', 0.0):.2f}",
            f"📈 Projected Revenue: ${summary.get('projected_revenue', 0.0):.2f}",
        ]
        roi = summary.get("roi")
        if roi is not None:
            lines.append(f"💹 ROI: {roi:.2f}x")
        ratio = summary.get("spend_to_revenue_ratio")
        if ratio is not None:
            lines.append(f"🔄 Spend/Revenue Ratio: {ratio:.2f}")
        lines.append(f"✅ Approved intents: {summary.get('approved_intents', 0)}")
        lines.append(f"🚫 Denied intents: {summary.get('denied_intents', 0)}")
        vendor_breakdown = summary.get("vendor_breakdown", {})
        agent_breakdown = summary.get("agent_breakdown", {})
        if vendor_breakdown:
            vendor_lines = ", ".join(f"{vendor}: ${amount:.2f}" for vendor, amount in vendor_breakdown.items())
            lines.append(f"Vendors: {vendor_lines}")
        if agent_breakdown:
            agent_lines = ", ".join(f"{agent}: ${amount:.2f}" for agent, amount in agent_breakdown.items())
            lines.append(f"Agents: {agent_lines}")
        dashboard_url = summary.get("dashboard_url")
        if dashboard_url:
            lines.append(f"🔗 Dashboard: {dashboard_url}")
        return "\n".join(lines)
    async def call_premium_llm(self, messages: List[Dict[str, Any]]) -> Dict[str, Any]:
        response = await self.payment_base._pay(
            "post",
            "https://llm-api.genesis.com/completions",
            self.payment_base.get_cost("call_premium_llm", 1.5),
            json={"model": "gpt-4.5-turbo", "messages": messages},
        )
        return response.json()

    async def optimize_prompt(self, prompt: str) -> Dict[str, Any]:
        response = await self.payment_base._pay(
            "post",
            "https://prompt-optimizer.genesis.com/optimize",
            self.payment_base.get_cost("optimize_prompt", 0.4),
            json={"base_prompt": prompt, "optimization_goal": "reduce_tokens"},
        )
        return response.json()

    def _create_workspace_manager(self, business_id: str, spec: BusinessSpec) -> WorkspaceStateManager:
        """Initialize workspace synthesis manager for the current run."""
        interval = int(os.getenv("WORKSPACE_SYNTHESIS_INTERVAL", "50"))
        return WorkspaceStateManager(
            business_id=business_id,
            persistence_root=spec.output_dir,
            summary_interval=max(5, interval),
            llm_callback=self._workspace_insight_callback,
        )

    async def _workspace_insight_callback(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Use analyst agent to synthesize workspace insights every interval."""
        prompt = (
            "You are Genesis' workspace synthesizer. Analyze the JSON payload summarizing "
            "recent agent progress and produce:\n"
            "1. `workspace_summary`: concise narrative (<=120 words).\n"
            "2. `risks`: list of concrete risks (<=4) or empty.\n"
            "3. `next_actions`: prioritized actions for the orchestrator.\n"
            "Respond with JSON only.\n\n"
            f"Payload:\n```json\n{json.dumps(payload, indent=2)}\n```"
        )

        try:
            response = await self._call_router("analyst_agent", prompt, temperature=0.1)
            if not response:
                raise ValueError("Empty response")
            parsed = json.loads(self._extract_json_block(response))
            if not isinstance(parsed, dict):
                raise ValueError("LLM returned non-dict JSON")
            return parsed
        except Exception as exc:
            logger.warning(f"Workspace insight synthesis failed: {exc}")
            return {
                "workspace_summary": "Analyst synthesis unavailable; using fallback.",
                "risks": [f"Insight callback error: {exc}"],
                "next_actions": [],
            }

    @staticmethod
    def _extract_json_block(raw_response: str) -> str:
        """Extract JSON content from potential code fences."""
        raw_response = raw_response.strip()
        if raw_response.startswith("```"):
            lines = raw_response.splitlines()
            json_lines = [line for line in lines[1:] if not line.startswith("```")]
            return "\n".join(json_lines)
        return raw_response
    
    async def autonomous_generate_business(
        self,
        business_idea: Optional[Any] = None,
        min_score: float = 70.0,
        max_components: int = len(AGENT_COMPONENT_REQUIREMENTS) * 2,
        min_components: int = 10
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
        
        components = self._ensure_agent_coverage(
            selection.components,
            max_components=max_components,
        )
        coverage_additions = [c for c in components if c not in selection.components]
        logger.info(f"✅ Selected {len(components)} components (build time: {selection.total_build_time_minutes}min)")
        logger.info(f"   Components: {components}")
        logger.info(f"   Reasoning: {selection.reasoning}")
        if coverage_additions:
            logger.info(f"   Added for agent coverage: {coverage_additions}")
        
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
                    "build_time_minutes": selection.total_build_time_minutes,
                    "coverage_additions": coverage_additions,
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

    async def handle_user_conversation(
        self,
        message: str,
        session_id: str,
        user_id: str,
        attachments: Optional[List[str]] = None,
        agent_name: str = "genesis_agent"
    ) -> Dict[str, Any]:
        """
        Handle user conversation with memory integration (Tier 1 - Critical).

        This method provides full memory persistence for user conversations:
        - Stores user messages in Memori (scope: user)
        - Queries user conversation history for context
        - Processes multimodal attachments (images/audio) via Gemini
        - Enforces per-user ACL
        - Persists sessions across restarts

        Args:
            message: User message text
            session_id: Session ID for conversation continuity
            user_id: User ID for ACL and memory isolation
            attachments: Optional list of attachment URIs (images/audio)
            agent_name: Agent to route conversation to (default: genesis_agent)

        Returns:
            Dict with:
                - response: Agent response text
                - history: Conversation history (last 10 messages)
                - multimodal_results: Processed attachments
                - session_context: Session metadata
                - processing_time_ms: Total processing time

        Example:
            result = await agent.handle_user_conversation(
                message="Tell me about my recent projects",
                session_id="session_123",
                user_id="user_456",
                attachments=["screenshot.png"]
            )

            print(result["response"])  # Agent response
            print(result["history"])    # Last 10 messages
        """
        if not self.enable_memory or not self.memory_integration:
            # Fallback: Handle without memory
            logger.warning("Memory integration disabled, running without persistent memory")

            # Direct LLM call without memory
            prompt = f"User request: {message}\n\nProvide a helpful response."
            response = await self._call_router(agent_name, prompt, temperature=0.7)

            return {
                "response": response,
                "history": [],
                "multimodal_results": [],
                "session_context": None,
                "processing_time_ms": 0.0,
                "memory_enabled": False
            }

        # Process message with full memory integration
        start_time = time.time()

        # 1. Handle message with memory integration
        memory_result = await self.memory_integration.handle_user_message(
            message=message,
            session_id=session_id,
            user_id=user_id,
            attachments=attachments,
            retrieve_history=True,
            history_window=10
        )

        processed_message = memory_result["processed_message"]
        history = memory_result["history"]

        # 2. Build context-aware prompt
        context_parts = []

        # Add conversation history
        if history:
            context_parts.append("## Conversation History:")
            for msg in history[-5:]:  # Last 5 messages for context
                role_label = "User" if msg["role"] == "user" else "Assistant"
                context_parts.append(f"{role_label}: {msg['content'][:200]}")  # Truncate long messages

        # Add multimodal content
        if memory_result["multimodal_results"]:
            context_parts.append("\n## Attachments:")
            for result in memory_result["multimodal_results"]:
                if result["content"]:
                    context_parts.append(f"- {result['type']}: {result['content'][:200]}")

        # Build full prompt
        context_str = "\n".join(context_parts) if context_parts else ""

        full_prompt = f"""You are Genesis, an AI assistant helping the user with their request.

{context_str}

## Current Request:
{processed_message}

Provide a helpful, contextual response based on the conversation history and any attachments."""

        # 3. Generate response via HALO router
        response = await self._call_router(
            agent_name=agent_name,
            prompt=full_prompt,
            temperature=0.7
        )

        if not response:
            response = "I apologize, but I'm unable to generate a response right now. Please try again."

        # 4. Store assistant response
        await self.memory_integration.store_assistant_response(
            response=response,
            session_id=session_id,
            user_id=user_id,
            metadata={
                "agent_name": agent_name,
                "has_attachments": bool(attachments),
                "history_count": len(history)
            }
        )

        processing_time_ms = (time.time() - start_time) * 1000

        return {
            "response": response,
            "history": history,
            "multimodal_results": memory_result["multimodal_results"],
            "session_context": memory_result["session_context"],
            "processing_time_ms": processing_time_ms,
            "memory_enabled": True
        }
