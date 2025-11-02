"""
Pipelex Adapter for Genesis Orchestration

Async wrapper for Pipelex workflow execution that integrates with Genesis Meta-Agent.
Converts Genesis tasks → Pipelex workflow inputs and handles HTDAG → Pipelex → agent routing.

Key Features:
- Async execution of .plx workflows
- Genesis task → Pipelex variable mapping
- HTDAG → Pipelex → HALO routing integration
- OTEL observability (tracing, metrics)
- Error handling with fallback to direct agent execution
- Timeout enforcement and resource limits

Author: Cursor (PinkLake)
Date: November 2, 2025
"""

import asyncio
import logging
import os
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple
from datetime import datetime

logger = logging.getLogger(__name__)

# Import Pipelex
try:
    import pipelex
    from pipelex import PipeRunner
    PIPELEX_AVAILABLE = True
except ImportError:
    PIPELEX_AVAILABLE = False
    logger.warning("Pipelex not available, adapter will use fallback execution")

# Import Genesis orchestration components
try:
    from infrastructure.halo_router import HALORouter
    from infrastructure.task_dag import Task as TaskDAGTask
    from infrastructure.model_registry import ModelRegistry
    HALO_AVAILABLE = True
except ImportError:
    HALO_AVAILABLE = False
    logger.warning("HALO router or ModelRegistry not available")

# Import OTEL observability
try:
    from infrastructure.observability import (
        get_observability_manager,
        CorrelationContext,
        SpanType
    )
    OTEL_AVAILABLE = True
except ImportError:
    OTEL_AVAILABLE = False
    logger.warning("OTEL observability not available")


class PipelexAdapter:
    """
    Async adapter for Pipelex workflow execution in Genesis orchestrator.
    
    Converts Genesis business creation tasks into Pipelex workflow executions,
    with integration to HTDAG, HALO router, and OTEL observability.
    
    Usage:
        adapter = PipelexAdapter(halo_router=halo_router, model_registry=model_registry)
        results = await adapter.execute_workflow(
            workflow_path="workflows/templates/ecommerce_business.plx",
            inputs={"business_niche": "sustainable fashion"}
        )
    """
    
    def __init__(
        self,
        halo_router: Optional[HALORouter] = None,
        model_registry: Optional[ModelRegistry] = None,
        timeout_seconds: int = 300
    ):
        """
        Initialize Pipelex adapter.
        
        Args:
            halo_router: Optional HALORouter for agent routing
            model_registry: Optional ModelRegistry for model execution
            timeout_seconds: Maximum execution time per workflow (default: 300s)
        """
        self.halo_router = halo_router
        self.model_registry = model_registry
        self.timeout_seconds = timeout_seconds
        
        # Initialize components if not provided
        if not self.halo_router and HALO_AVAILABLE:
            self.halo_router = HALORouter()
            logger.info("PipelexAdapter: HALO router initialized")
        
        if not self.model_registry and HALO_AVAILABLE:
            try:
                self.model_registry = ModelRegistry()
                logger.info("PipelexAdapter: ModelRegistry initialized")
            except Exception as e:
                logger.warning(f"PipelexAdapter: Could not initialize ModelRegistry: {e}")
        
        # Initialize Pipelex runner
        if PIPELEX_AVAILABLE:
            try:
                self.runner = PipeRunner()
                logger.info("PipelexAdapter: Pipelex runner initialized")
            except Exception as e:
                logger.warning(f"PipelexAdapter: Could not initialize PipeRunner: {e}")
                self.runner = None
        else:
            self.runner = None
    
    def _map_genesis_task_to_pipelex_inputs(
        self,
        genesis_task: Dict[str, Any],
        business_type: str
    ) -> Dict[str, str]:
        """
        Convert Genesis task to Pipelex workflow inputs.
        
        Maps Genesis business requirements to Pipelex template variables.
        
        Args:
            genesis_task: Genesis task dictionary with business requirements
            business_type: Business type (ecommerce, content_platform, saas_product)
        
        Returns:
            Dictionary of Pipelex template variables
        """
        inputs = {}
        
        # Map business niche
        if "niche" in genesis_task:
            inputs["business_niche"] = genesis_task["niche"]
        elif "business_niche" in genesis_task:
            inputs["business_niche"] = genesis_task["business_niche"]
        
        # Map problem space (for SaaS)
        if business_type == "saas_product" and "problem" in genesis_task:
            inputs["problem_space"] = genesis_task["problem"]
        
        # Map target audience
        if "target_audience" in genesis_task:
            if business_type == "content_platform":
                inputs["niche"] = genesis_task.get("niche", genesis_task["target_audience"])
        
        # Add default variables
        if "business_niche" not in inputs and "niche" in genesis_task:
            inputs["business_niche"] = genesis_task["niche"]
        
        logger.debug(f"Mapped Genesis task to Pipelex inputs: {inputs}")
        return inputs
    
    async def _execute_pipe_async(
        self,
        pipe: Dict[str, Any],
        inputs: Dict[str, Any],
        context: Optional[Dict[str, Any]] = None
    ) -> Any:
        """
        Execute a single Pipelex pipe asynchronously.
        
        Args:
            pipe: Pipe definition from workflow template
            inputs: Input variables for the pipe
            context: Optional context from previous pipes
        
        Returns:
            Pipe execution result
        """
        pipe_type = pipe.get("type", "unknown")
        pipe_name = pipe.get("name", "unnamed")
        
        logger.debug(f"Executing pipe: {pipe_name} (type: {pipe_type})")
        
        if pipe_type == "PipeLLM":
            # Execute LLM pipe via ModelRegistry
            if self.model_registry and HALO_AVAILABLE:
                # Route to appropriate agent via HALO
                task_desc = pipe.get("user_prompt", "").format(**inputs)
                agent_name = await self._route_to_agent(task_desc)
                
                # Build messages for LLM call
                messages = []
                if "system_prompt" in pipe:
                    messages.append({"role": "system", "content": pipe["system_prompt"]})
                messages.append({"role": "user", "content": task_desc})
                
                # Execute via ModelRegistry
                result = await self.model_registry.chat_async(
                    agent_name,
                    messages
                )
                return result
            else:
                # Fallback: Use Pipelex runner directly (synchronous)
                if self.runner:
                    # Run in executor to make it async
                    loop = asyncio.get_event_loop()
                    result = await loop.run_in_executor(
                        None,
                        lambda: self.runner.execute_pipe(pipe, inputs, context)
                    )
                    return result
                else:
                    raise RuntimeError("No execution method available")
        
        elif pipe_type == "PipeParallel":
            # Execute parallel pipes
            pipe_names = pipe.get("pipes", [])
            tasks = []
            for pipe_name in pipe_names:
                # Find pipe definition (would need workflow context)
                # For now, return placeholder
                tasks.append(asyncio.create_task(
                    self._execute_pipe_async({"type": "PipeLLM", "name": pipe_name}, inputs, context)
                ))
            
            results = await asyncio.gather(*tasks)
            return results
        
        else:
            raise ValueError(f"Unknown pipe type: {pipe_type}")
    
    async def _route_to_agent(self, task_description: str) -> str:
        """
        Route task to appropriate agent via HALO router.
        
        Args:
            task_description: Task description string
        
        Returns:
            Agent name for execution
        """
        if self.halo_router:
            try:
                # Create task for HALO router
                task = TaskDAGTask(
                    task_id=f"pipelex_{hash(task_description) % 100000}",
                    task_type="business_creation",
                    description=task_description
                )
                
                # Route to agent
                routing_plan = await self.halo_router.route_tasks([task])
                agent_name = routing_plan.assignments.get(task.task_id, "qa_agent")  # Default fallback
                return agent_name
            except Exception as e:
                logger.warning(f"HALO routing failed: {e}, using default agent")
                return "qa_agent"  # Default fallback
        else:
            return "qa_agent"  # Default fallback
    
    async def execute_workflow(
        self,
        workflow_path: str,
        inputs: Optional[Dict[str, Any]] = None,
        genesis_task: Optional[Dict[str, Any]] = None,
        business_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Execute a Pipelex workflow asynchronously.
        
        Args:
            workflow_path: Path to .plx workflow template
            inputs: Optional direct Pipelex inputs (if provided, genesis_task is ignored)
            genesis_task: Optional Genesis task (will be converted to inputs)
            business_type: Optional business type for mapping (if genesis_task provided)
        
        Returns:
            Dictionary of workflow results (concept outputs)
        
        Raises:
            ValueError: If workflow path invalid or execution fails
            TimeoutError: If execution exceeds timeout
        """
        workflow_file = Path(workflow_path)
        if not workflow_file.exists():
            raise ValueError(f"Workflow file not found: {workflow_path}")
        
        # Prepare inputs
        if inputs is None:
            if genesis_task is None:
                raise ValueError("Either inputs or genesis_task must be provided")
            
            # Infer business type from workflow path if not provided
            if business_type is None:
                if "ecommerce" in workflow_path:
                    business_type = "ecommerce"
                elif "content" in workflow_path:
                    business_type = "content_platform"
                elif "saas" in workflow_path:
                    business_type = "saas_product"
            
            inputs = self._map_genesis_task_to_pipelex_inputs(genesis_task, business_type or "unknown")
        
        # OTEL tracing
        obs_manager = None
        context = None
        if OTEL_AVAILABLE:
            try:
                obs_manager = get_observability_manager()
                # Create correlation context for tracing
                context = CorrelationContext(
                    correlation_id=f"pipelex_{workflow_path}_{hash(str(inputs)) % 100000}"
                )
            except Exception as e:
                logger.warning(f"Could not get observability manager: {e}")
                context = None
        
        # Execute workflow with timeout
        try:
            if obs_manager:
                # Use OTEL context manager for tracing
                with obs_manager.span(
                    name=f"pipelex.execute_workflow",
                    span_type=SpanType.ORCHESTRATION,
                    context=context
                ) as span:
                    # Set span attributes
                    if hasattr(span, 'set_attribute'):
                        span.set_attribute("workflow.path", workflow_path)
                        span.set_attribute("workflow.business_type", business_type or "unknown")
                        span.set_attribute("workflow.inputs", str(inputs))
                    elif hasattr(obs_manager, 'set_attribute'):
                        obs_manager.set_attribute("workflow.path", workflow_path)
                        obs_manager.set_attribute("workflow.business_type", business_type or "unknown")
                        obs_manager.set_attribute("workflow.inputs", str(inputs))
                    
                    result = await asyncio.wait_for(
                        self._execute_workflow_internal(workflow_path, inputs),
                        timeout=self.timeout_seconds
                    )
            else:
                result = await asyncio.wait_for(
                    self._execute_workflow_internal(workflow_path, inputs),
                    timeout=self.timeout_seconds
                )
            
            logger.info(f"Workflow execution complete: {workflow_path}")
            return result
        
        except asyncio.TimeoutError:
            logger.error(f"Workflow execution timeout: {workflow_path} (>{self.timeout_seconds}s)")
            raise TimeoutError(f"Workflow execution exceeded {self.timeout_seconds}s timeout")
        
        except Exception as e:
            logger.error(f"Workflow execution failed: {workflow_path} - {e}")
            
            # Fallback to direct agent execution
            if genesis_task:
                logger.info("Falling back to direct agent execution")
                return await self._fallback_execution(genesis_task, business_type)
            else:
                raise
    
    async def _execute_workflow_internal(
        self,
        workflow_path: str,
        inputs: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Internal workflow execution method.
        
        Args:
            workflow_path: Path to workflow template
            inputs: Workflow input variables
        
        Returns:
            Dictionary of concept outputs
        """
        # Try Pipelex execution first
        if self.runner and PIPELEX_AVAILABLE:
            try:
                # Use Pipelex CLI execution (run in executor)
                loop = asyncio.get_event_loop()
                
                # Execute via Pipelex CLI (subprocess)
                import subprocess
                import json
                
                # Prepare environment with inputs
                env = os.environ.copy()
                for key, value in inputs.items():
                    env[f"PIPELEX_VAR_{key.upper()}"] = str(value)
                
                # Execute pipelex run command
                proc = await asyncio.create_subprocess_exec(
                    "./venv/bin/pipelex",
                    "run",
                    str(workflow_path),
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE,
                    env=env,
                    cwd=str(Path(workflow_path).parent.parent.parent)
                )
                
                stdout, stderr = await asyncio.wait_for(
                    proc.communicate(),
                    timeout=self.timeout_seconds
                )
                
                if proc.returncode == 0:
                    # Parse output (Pipelex may output JSON or text)
                    try:
                        results = json.loads(stdout.decode())
                    except json.JSONDecodeError:
                        # If not JSON, treat as text result
                        results = {"output": stdout.decode()}
                    
                    # Convert to Genesis format
                    genesis_results = {}
                    for concept_name, concept_data in results.items():
                        genesis_results[concept_name.lower().replace(" ", "_")] = concept_data
                    
                    return genesis_results
                else:
                    error_msg = stderr.decode() if stderr else "Unknown error"
                    logger.error(f"Pipelex execution failed: {error_msg}")
                    raise RuntimeError(f"Pipelex execution failed: {error_msg}")
            
            except Exception as e:
                logger.warning(f"Pipelex execution error: {e}, falling back to agent execution")
                raise
        
        # Fallback: Execute via agents directly
        raise RuntimeError("Pipelex runner not available, use fallback execution")
    
    async def _fallback_execution(
        self,
        genesis_task: Dict[str, Any],
        business_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Fallback execution when Pipelex fails.
        
        Executes business creation directly via Genesis agents.
        
        Args:
            genesis_task: Genesis task dictionary
            business_type: Business type for routing
        
        Returns:
            Dictionary of execution results
        """
        logger.info("Using fallback execution via direct agent calls")
        
        if not self.model_registry:
            raise RuntimeError("ModelRegistry not available for fallback")
        
        # Route task to appropriate agent
        task_desc = genesis_task.get("description", "Create business")
        agent_name = await self._route_to_agent(task_desc)
        
        # Execute via ModelRegistry
        messages = [{"role": "user", "content": task_desc}]
        result = await self.model_registry.chat_async(agent_name, messages)
        
        # Return in similar format to Pipelex results
        return {
            "result": result,
            "agent": agent_name,
            "fallback": True
        }


# Convenience function for Genesis integration
async def execute_pipelex_workflow(
    workflow_path: str,
    inputs: Optional[Dict[str, Any]] = None,
    genesis_task: Optional[Dict[str, Any]] = None,
    business_type: Optional[str] = None,
    timeout_seconds: int = 300
) -> Dict[str, Any]:
    """
    Execute a Pipelex workflow from Genesis orchestrator.
    
    Convenience function that creates adapter and executes workflow.
    
    Args:
        workflow_path: Path to .plx workflow template
        inputs: Optional direct Pipelex inputs
        genesis_task: Optional Genesis task (will be converted to inputs)
        business_type: Optional business type for mapping
        timeout_seconds: Maximum execution time (default: 300s)
    
    Returns:
        Dictionary of workflow results (concept outputs)
    
    Example:
        result = await execute_pipelex_workflow(
            workflow_path="workflows/templates/ecommerce_business.plx",
            inputs={"business_niche": "sustainable fashion"}
        )
        # Returns: {"productcatalog": {...}, "websitedesign": {...}, ...}
    """
    adapter = PipelexAdapter(timeout_seconds=timeout_seconds)
    return await adapter.execute_workflow(
        workflow_path=workflow_path,
        inputs=inputs,
        genesis_task=genesis_task,
        business_type=business_type
    )

