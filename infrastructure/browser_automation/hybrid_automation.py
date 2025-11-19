"""
Hybrid Automation - Routes between VOIX and fallback automation

Implements intelligent routing logic to use VOIX when available,
falling back to traditional browser automation (Skyvern/Gemini Computer Use)
"""

import asyncio
import json
import logging
import time
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

from infrastructure.browser_automation.voix_detector import VoixDetector, VoixTool, VoixContext
from infrastructure.browser_automation.voix_executor import VoixExecutor, VoixExecutionResult
from infrastructure.gemini_computer_use import GeminiComputerUseClient
from infrastructure.llm_client import LLMFactory, LLMProvider

logger = logging.getLogger(__name__)


@dataclass
class AutomationResult:
    """Result of automation execution"""

    success: bool
    method: str  # "voix" or "fallback"
    result: Any
    discovery_time_ms: float = 0.0
    execution_time_ms: float = 0.0
    error: Optional[str] = None
    tools_used: List[str] = field(default_factory=list)
    metrics: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "success": self.success,
            "method": self.method,
            "result": self.result,
            "discovery_time_ms": self.discovery_time_ms,
            "execution_time_ms": self.execution_time_ms,
            "error": self.error,
            "tools_used": self.tools_used,
            "metrics": self.metrics,
        }


class HybridAutomation:
    """
    Hybrid automation router

    Routes between VOIX and fallback automation based on:
    - VOIX tag detection
    - Tool availability
    - LLM-based intelligent selection
    """

    def __init__(
        self,
        agent_role: str = "generic",
        use_llm_selection: bool = True,
        fallback_client: Optional[GeminiComputerUseClient] = None,
    ):
        """
        Initialize hybrid automation

        Args:
            agent_role: Role of the agent using automation
            use_llm_selection: Use LLM for intelligent tool selection
            fallback_client: Optional fallback browser automation client
        """
        self.agent_role = agent_role
        self.use_llm_selection = use_llm_selection
        self.detector = VoixDetector()
        self.executor = VoixExecutor()
        self.fallback_client = fallback_client

        # Performance metrics
        self.metrics = {
            "voix_detections": 0,
            "voix_executions": 0,
            "fallback_executions": 0,
            "total_discovery_time_ms": 0.0,
            "total_execution_time_ms": 0.0,
        }

    async def navigate_and_act(
        self,
        url: str,
        action_description: str,
        parameters: Optional[Dict[str, Any]] = None,
    ) -> AutomationResult:
        """
        Navigate to URL and perform action

        Args:
            url: URL to navigate to
            action_description: Description of action to perform
            parameters: Optional parameters for the action

        Returns:
            AutomationResult with execution outcome
        """
        discovery_start = time.time()

        # Detect VOIX tools
        tools = await self.detect_voix_tools(url)
        discovery_time = (time.time() - discovery_start) * 1000
        self.metrics["total_discovery_time_ms"] += discovery_time

        if tools:
            self.metrics["voix_detections"] += 1
            logger.info(f"VOIX tools detected on {url}: {[t.name for t in tools]}")
            voix_result = await self.execute_via_voix(url, action_description, tools, parameters or {})
            if voix_result.success:
                return voix_result
            logger.warning("VOIX execution failed, falling back to legacy automation")
            return await self.execute_via_fallback(url, action_description, parameters or {})
        else:
            logger.info(f"No VOIX tools found on {url}, using fallback")
            return await self.execute_via_fallback(url, action_description, parameters or {})

    async def detect_voix_tools(self, url: str) -> List[VoixTool]:
        """
        Detect VOIX tools on a page

        Args:
            url: URL to scan

        Returns:
            List of detected VoixTool objects
        """
        try:
            # In real implementation, this would:
            # 1. Navigate to URL with browser
            # 2. Inject JavaScript discovery script
            # 3. Extract HTML or use DOM API
            # 4. Parse VOIX tags

            # For now, we'll simulate by fetching HTML
            import aiohttp
            async with aiohttp.ClientSession() as session:
                async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as response:
                    html = await response.text()
                    scan_result = self.detector.scan_dom(html, base_url=url)
                    return [VoixTool.from_dict(t) for t in scan_result["tools"]]

        except Exception as e:
            logger.warning(f"Failed to detect VOIX tools on {url}: {e}")
            return []

    async def execute_via_voix(
        self,
        url: str,
        action_description: str,
        tools: List[VoixTool],
        parameters: Dict[str, Any],
    ) -> AutomationResult:
        """
        Execute action via VOIX

        Args:
            url: URL being automated
            action_description: Description of action
            tools: Available VOIX tools
            parameters: Action parameters

        Returns:
            AutomationResult
        """
        execution_start = time.time()

        # Select tool via LLM or simple matching
        selected_tool = await self._select_tool(action_description, tools)

        if not selected_tool:
            logger.warning("No suitable VOIX tool found, falling back")
            return await self.execute_via_fallback(url, action_description, parameters)

        # Execute tool
        async with self.executor:
            result = await self.executor.execute_tool(selected_tool, parameters)

        execution_time = (time.time() - execution_start) * 1000
        self.metrics["voix_executions"] += 1
        self.metrics["total_execution_time_ms"] += execution_time

        return AutomationResult(
            success=result.success,
            method="voix",
            result=result.response_data,
            discovery_time_ms=0,  # Already accounted in navigate_and_act
            execution_time_ms=execution_time,
            error=result.error,
            tools_used=[selected_tool.name],
            metrics={
                "status_code": result.status_code,
                "tool_name": selected_tool.name,
            },
        )

    async def execute_via_fallback(
        self,
        url: str,
        action_description: str,
        parameters: Dict[str, Any],
    ) -> AutomationResult:
        """
        Execute action via fallback automation (Gemini Computer Use)

        Args:
            url: URL to navigate to
            action_description: Description of action
            parameters: Action parameters

        Returns:
            AutomationResult
        """
        execution_start = time.time()

        try:
            if not self.fallback_client:
                self.fallback_client = GeminiComputerUseClient(agent_role=self.agent_role)

            await self.fallback_client.start_browser()
            await self.fallback_client.navigate(url)

            # Execute autonomous task
            task_result = await self.fallback_client.autonomous_task(
                task_description=action_description,
                max_steps=20,
            )

            execution_time = (time.time() - execution_start) * 1000
            self.metrics["fallback_executions"] += 1
            self.metrics["total_execution_time_ms"] += execution_time

            return AutomationResult(
                success=task_result.get("success", False),
                method="fallback",
                result=task_result,
                discovery_time_ms=0,
                execution_time_ms=execution_time,
                error=task_result.get("error"),
                tools_used=["gemini_computer_use"],
                metrics={
                    "final_state": task_result.get("final_state"),
                    "steps": len(task_result.get("steps", [])),
                },
            )

        except Exception as e:
            execution_time = (time.time() - execution_start) * 1000
            logger.exception(f"Fallback automation failed: {e}")
            return AutomationResult(
                success=False,
                method="fallback",
                result=None,
                discovery_time_ms=0,
                execution_time_ms=execution_time,
                error=str(e),
                tools_used=[],
                metrics={},
            )

    async def _select_tool(
        self,
        action_description: str,
        tools: List[VoixTool],
    ) -> Optional[VoixTool]:
        """
        Select appropriate tool for action

        Uses LLM if enabled, otherwise simple keyword matching
        """
        if not tools:
            return None

        if len(tools) == 1:
            return tools[0]

        if self.use_llm_selection:
            return await self._llm_select_tool(action_description, tools)
        else:
            return self._simple_select_tool(action_description, tools)

    async def _llm_select_tool(
        self,
        action_description: str,
        tools: List[VoixTool],
    ) -> Optional[VoixTool]:
        """Use LLM to select best tool"""
        try:
            llm_client = LLMFactory.get_client(
                LLMProvider.CLAUDE_HAIKU_4_5,
                model="claude-3-haiku-20240307",
            )

            tools_json = json.dumps([t.to_dict() for t in tools], indent=2)
            prompt = f"""Select the best VOIX tool for this action:

Action: {action_description}

Available tools:
{tools_json}

Respond with just the tool name (exactly as shown in the 'name' field)."""

            response = llm_client.generate(
                system_prompt="You are a tool selection assistant. Choose the most appropriate tool for the given action.",
                user_prompt=prompt,
                temperature=0.1,
            )

            selected_name = response.strip().strip('"').strip("'")
            for tool in tools:
                if tool.name.lower() == selected_name.lower():
                    return tool

            # Fallback to first tool if LLM selection fails
            logger.warning(f"LLM selected unknown tool '{selected_name}', using first tool")
            return tools[0]

        except Exception as e:
            logger.warning(f"LLM tool selection failed: {e}, using simple selection")
            return self._simple_select_tool(action_description, tools)

    def _simple_select_tool(
        self,
        action_description: str,
        tools: List[VoixTool],
    ) -> Optional[VoixTool]:
        """Simple keyword-based tool selection"""
        action_lower = action_description.lower()

        # Score tools based on keyword matching
        scored_tools = []
        for tool in tools:
            score = 0
            tool_desc_lower = tool.description.lower()
            tool_name_lower = tool.name.lower()

            # Check for common action keywords
            if any(keyword in action_lower for keyword in ["submit", "post", "create"]):
                if "submit" in tool_name_lower or "create" in tool_name_lower:
                    score += 10
            if any(keyword in action_lower for keyword in ["get", "fetch", "retrieve"]):
                if "get" in tool_name_lower or "fetch" in tool_name_lower:
                    score += 10
            if any(keyword in action_lower for keyword in ["update", "edit", "modify"]):
                if "update" in tool_name_lower or "edit" in tool_name_lower:
                    score += 10

            # Check description matching
            for word in action_lower.split():
                if word in tool_desc_lower:
                    score += 1

            scored_tools.append((score, tool))

        # Return highest scoring tool
        if scored_tools:
            scored_tools.sort(key=lambda x: x[0], reverse=True)
            return scored_tools[0][1]

        return tools[0] if tools else None

    def get_metrics(self) -> Dict[str, Any]:
        """Get performance metrics"""
        total_executions = self.metrics["voix_executions"] + self.metrics["fallback_executions"]
        avg_discovery = (
            self.metrics["total_discovery_time_ms"] / self.metrics["voix_detections"]
            if self.metrics["voix_detections"] > 0
            else 0
        )
        avg_execution = (
            self.metrics["total_execution_time_ms"] / total_executions
            if total_executions > 0
            else 0
        )

        return {
            **self.metrics,
            "total_executions": total_executions,
            "avg_discovery_time_ms": avg_discovery,
            "avg_execution_time_ms": avg_execution,
            "voix_success_rate": (
                self.metrics["voix_executions"] / total_executions * 100
                if total_executions > 0
                else 0
            ),
        }
