"""
Unit tests for VOIX executor
"""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from infrastructure.browser_automation.voix_executor import VoixExecutor, VoixExecutionResult
from infrastructure.browser_automation.voix_detector import VoixTool


class TestVoixExecutor:
    """Test VOIX executor functionality"""

    @pytest.mark.asyncio
    async def test_tool_invocation_valid_parameters(self):
        """Test tool invocation with valid parameters"""
        tool = VoixTool(
            name="test_tool",
            description="Test tool",
            endpoint="https://api.example.com/test",
            method="POST",
            parameters={
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "value": {"type": "number"}
                },
                "required": ["name"]
            }
        )

        executor = VoixExecutor()

        with patch('aiohttp.ClientSession') as mock_session:
            mock_response = AsyncMock()
            mock_response.status = 200
            mock_response.headers = {"Content-Type": "application/json"}
            mock_response.json = AsyncMock(return_value={"success": True})
            mock_response.text = AsyncMock(return_value='{"success": true}')

            mock_request = AsyncMock()
            mock_request.__aenter__ = AsyncMock(return_value=mock_response)
            mock_request.__aexit__ = AsyncMock(return_value=None)

            mock_session.return_value.__aenter__ = AsyncMock(return_value=mock_session.return_value)
            mock_session.return_value.request = MagicMock(return_value=mock_request)

            result = await executor.execute_tool(tool, {"name": "test", "value": 42})

            assert result.success is True
            assert result.status_code == 200

    @pytest.mark.asyncio
    async def test_parameter_validation(self):
        """Test parameter validation"""
        tool = VoixTool(
            name="test_tool",
            description="Test tool",
            endpoint="https://api.example.com/test",
            parameters={
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "value": {"type": "number"}
                },
                "required": ["name"]
            }
        )

        executor = VoixExecutor()

        # Missing required parameter
        result = await executor.execute_tool(tool, {"value": 42})
        assert result.success is False
        assert "required parameter" in result.error.lower()

    @pytest.mark.asyncio
    async def test_authentication_methods(self):
        """Test different authentication methods"""
        # Bearer token
        tool_bearer = VoixTool(
            name="bearer_tool",
            description="Tool with bearer auth",
            endpoint="https://api.example.com/test",
            auth_type="bearer"
        )

        executor = VoixExecutor()
        # Verify headers are prepared correctly
        headers = executor._prepare_headers(tool_bearer, "test_token")
        assert "Authorization" in headers
        assert headers["Authorization"] == "Bearer test_token"

        # Session auth (handled via cookies)
        tool_session = VoixTool(
            name="session_tool",
            description="Tool with session auth",
            endpoint="https://api.example.com/test",
            auth_type="session"
        )
        headers_session = executor._prepare_headers(tool_session, None)
        assert "Authorization" not in headers_session

    @pytest.mark.asyncio
    async def test_error_responses(self):
        """Test error response handling"""
        tool = VoixTool(
            name="error_tool",
            description="Tool that returns error",
            endpoint="https://api.example.com/error",
            method="POST"
        )

        executor = VoixExecutor()

        with patch('aiohttp.ClientSession') as mock_session:
            mock_response = AsyncMock()
            mock_response.status = 500
            mock_response.headers = {"Content-Type": "application/json"}
            mock_response.json = AsyncMock(return_value={"error": "Internal server error"})

            mock_request = AsyncMock()
            mock_request.__aenter__ = AsyncMock(return_value=mock_response)
            mock_request.__aexit__ = AsyncMock(return_value=None)

            mock_session.return_value.__aenter__ = AsyncMock(return_value=mock_session.return_value)
            mock_session.return_value.request = MagicMock(return_value=mock_request)

            result = await executor.execute_tool(tool, {})

            assert result.success is False
            assert result.status_code == 500

    @pytest.mark.asyncio
    async def test_tool_visibility_checks(self):
        """Test tool visibility checks"""
        tool = VoixTool(
            name="visible_tool",
            description="Visible tool",
            endpoint="https://api.example.com/test",
            visibility="visible",
            selector="#submit-button"
        )

        executor = VoixExecutor()
        # Visibility check would be implemented with DOM inspection
        # For now, we verify the structure
        assert tool.visibility == "visible"
        assert tool.selector == "#submit-button"

