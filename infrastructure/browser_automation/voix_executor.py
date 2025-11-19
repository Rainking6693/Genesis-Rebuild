"""
VOIX Executor - Executes VOIX tool invocations

Handles HTTP requests, authentication, and response parsing
"""

import asyncio
import json
import logging
import time
from dataclasses import dataclass
from typing import Any, Dict, Optional
from urllib.parse import urljoin

import aiohttp

logger = logging.getLogger(__name__)


@dataclass
class VoixExecutionResult:
    """Result of a VOIX tool execution"""

    success: bool
    status_code: int
    response_data: Any
    error: Optional[str] = None
    execution_time_ms: float = 0.0
    tool_name: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return {
            "success": self.success,
            "status_code": self.status_code,
            "response_data": self.response_data,
            "error": self.error,
            "execution_time_ms": self.execution_time_ms,
            "tool_name": self.tool_name,
        }


class VoixExecutor:
    """
    Executes VOIX tool invocations

    Features:
    - HTTP endpoint invocation (GET/POST/PUT/DELETE)
    - Authentication handling (session/bearer/none)
    - Parameter validation
    - Response parsing
    - Error handling
    - Tool visibility checks
    """

    def __init__(self, session: Optional[aiohttp.ClientSession] = None):
        """
        Initialize VOIX executor

        Args:
            session: Optional aiohttp session for connection pooling
        """
        self.session = session
        self._own_session = session is None

    async def __aenter__(self):
        if self._own_session:
            self.session = aiohttp.ClientSession()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self._own_session and self.session:
            await self.session.close()

    async def execute_tool(
        self,
        tool: "VoixTool",
        parameters: Dict[str, Any],
        auth_token: Optional[str] = None,
        session_cookies: Optional[Dict[str, str]] = None,
    ) -> VoixExecutionResult:
        """
        Execute a VOIX tool

        Args:
            tool: VoixTool to execute
            parameters: Parameters to pass to the tool
            auth_token: Bearer token for authentication
            session_cookies: Session cookies for authentication

        Returns:
            VoixExecutionResult with execution outcome
        """
        start_time = time.time()
        tool_name = tool.name

        try:
            # Validate parameters
            validation_error = self._validate_parameters(tool, parameters)
            if validation_error:
                return VoixExecutionResult(
                    success=False,
                    status_code=400,
                    response_data=None,
                    error=validation_error,
                    execution_time_ms=(time.time() - start_time) * 1000,
                    tool_name=tool_name,
                )

            # Check tool visibility (if selector provided)
            if tool.selector:
                # Note: In real implementation, this would check DOM visibility
                # For now, we assume visible if selector is provided
                pass

            # Prepare request
            headers = self._prepare_headers(tool, auth_token)
            cookies = session_cookies or {}

            session = self.session
            own_session = False
            if not session:
                session = aiohttp.ClientSession()
                own_session = True

            try:
                async with session.request(
                    method=tool.method,
                    url=tool.endpoint,
                    headers=headers,
                    cookies=cookies,
                    json=parameters if tool.method in ("POST", "PUT", "PATCH") else None,
                    params=parameters if tool.method == "GET" else None,
                    timeout=aiohttp.ClientTimeout(total=30),
                ) as response:
                    response_data = await self._parse_response(response)
                    execution_time = (time.time() - start_time) * 1000

                    logger.info(
                        f"VOIX tool '{tool_name}' executed: {response.status} "
                        f"({execution_time:.1f}ms)"
                    )

                    return VoixExecutionResult(
                        success=200 <= response.status < 300,
                        status_code=response.status,
                        response_data=response_data,
                        error=None if 200 <= response.status < 300 else f"HTTP {response.status}",
                        execution_time_ms=execution_time,
                        tool_name=tool_name,
                    )
            except aiohttp.ClientError as e:
                execution_time = (time.time() - start_time) * 1000
                logger.error(f"VOIX tool '{tool_name}' execution failed: {e}")
                return VoixExecutionResult(
                    success=False,
                    status_code=0,
                    response_data=None,
                    error=str(e),
                    execution_time_ms=execution_time,
                    tool_name=tool_name,
                )
            finally:
                if own_session:
                    close_result = session.close()
                    if asyncio.iscoroutine(close_result):
                        await close_result

        except Exception as e:
            execution_time = (time.time() - start_time) * 1000
            logger.exception(f"Unexpected error executing VOIX tool '{tool_name}': {e}")
            return VoixExecutionResult(
                success=False,
                status_code=500,
                response_data=None,
                error=str(e),
                execution_time_ms=execution_time,
                tool_name=tool_name,
            )

    def _validate_parameters(self, tool: "VoixTool", parameters: Dict[str, Any]) -> Optional[str]:
        """Validate parameters against tool schema"""
        required_params = tool.parameters.get("required", [])
        properties = tool.parameters.get("properties", {})

        # Check required parameters
        for param_name in required_params:
            if param_name not in parameters:
                return f"Missing required parameter: {param_name}"

        # Validate parameter types
        for param_name, param_value in parameters.items():
            if param_name in properties:
                param_schema = properties[param_name]
                expected_type = param_schema.get("type")
                if expected_type:
                    if expected_type == "string" and not isinstance(param_value, str):
                        return f"Parameter '{param_name}' must be a string"
                    elif expected_type == "number" and not isinstance(param_value, (int, float)):
                        return f"Parameter '{param_name}' must be a number"
                    elif expected_type == "boolean" and not isinstance(param_value, bool):
                        return f"Parameter '{param_name}' must be a boolean"
                    elif expected_type == "array" and not isinstance(param_value, list):
                        return f"Parameter '{param_name}' must be an array"
                    elif expected_type == "object" and not isinstance(param_value, dict):
                        return f"Parameter '{param_name}' must be an object"

        return None

    def _prepare_headers(self, tool: "VoixTool", auth_token: Optional[str]) -> Dict[str, str]:
        """Prepare HTTP headers for request"""
        headers = {
            "Content-Type": "application/json",
            "User-Agent": "Genesis-VOIX/1.0",
        }

        if tool.auth_type == "bearer" and auth_token:
            headers["Authorization"] = f"Bearer {auth_token}"
        elif tool.auth_type == "session":
            # Session auth handled via cookies
            pass

        return headers

    async def _parse_response(self, response: aiohttp.ClientResponse) -> Any:
        """Parse HTTP response"""
        content_type = response.headers.get("Content-Type", "")

        if "application/json" in content_type:
            try:
                return await response.json()
            except json.JSONDecodeError:
                return await response.text()
        else:
            return await response.text()
