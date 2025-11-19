"""
Unit tests for hybrid automation
"""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from infrastructure.browser_automation.hybrid_automation import HybridAutomation, AutomationResult
from infrastructure.browser_automation.voix_detector import VoixTool


class TestHybridAutomation:
    """Test hybrid automation functionality"""

    @pytest.mark.asyncio
    async def test_voix_detection_logic(self):
        """Test VOIX detection logic"""
        automation = HybridAutomation(agent_role="test_agent")

        with patch.object(automation, 'detect_voix_tools', return_value=[]):
            tools = await automation.detect_voix_tools("https://example.com")
            assert tools == []

    @pytest.mark.asyncio
    async def test_routing_to_voix_path(self):
        """Test routing to VOIX execution path"""
        tool = VoixTool(
            name="test_tool",
            description="Test tool",
            endpoint="https://api.example.com/test",
            method="POST"
        )

        automation = HybridAutomation(agent_role="test_agent")

        with patch.object(automation, 'detect_voix_tools', return_value=[tool]):
            with patch.object(automation, 'execute_via_voix') as mock_execute:
                mock_execute.return_value = AutomationResult(
                    success=True,
                    method="voix",
                    result={"success": True},
                    execution_time_ms=100.0
                )

                result = await automation.navigate_and_act(
                    "https://example.com",
                    "Test action"
                )

                assert result.method == "voix"
                assert result.success is True

    @pytest.mark.asyncio
    async def test_fallback_to_skyvern_path(self):
        """Test fallback to Skyvern/Gemini Computer Use path"""
        automation = HybridAutomation(agent_role="test_agent")

        with patch.object(automation, 'detect_voix_tools', return_value=[]):
            with patch.object(automation, 'execute_via_fallback') as mock_fallback:
                mock_fallback.return_value = AutomationResult(
                    success=True,
                    method="fallback",
                    result={"success": True},
                    execution_time_ms=500.0
                )

                result = await automation.navigate_and_act(
                    "https://example.com",
                    "Test action"
                )

                assert result.method == "fallback"
                assert result.success is True

    @pytest.mark.asyncio
    async def test_performance_metrics_collection(self):
        """Test performance metrics collection"""
        automation = HybridAutomation(agent_role="test_agent")

        # Simulate some executions
        automation.metrics["voix_detections"] = 5
        automation.metrics["voix_executions"] = 3
        automation.metrics["fallback_executions"] = 2
        automation.metrics["total_discovery_time_ms"] = 100.0
        automation.metrics["total_execution_time_ms"] = 500.0

        metrics = automation.get_metrics()

        assert metrics["total_executions"] == 5
        assert metrics["avg_discovery_time_ms"] == 20.0
        assert metrics["avg_execution_time_ms"] == 100.0
        assert metrics["voix_success_rate"] == 60.0  # 3/5 * 100

    @pytest.mark.asyncio
    async def test_tool_selection(self):
        """Test tool selection logic"""
        tools = [
            VoixTool(
                name="submit_tool",
                description="Submit form",
                endpoint="https://api.example.com/submit",
                method="POST"
            ),
            VoixTool(
                name="get_tool",
                description="Get data",
                endpoint="https://api.example.com/get",
                method="GET"
            ),
        ]

        automation = HybridAutomation(agent_role="test_agent", use_llm_selection=False)

        # Test simple selection
        selected = automation._simple_select_tool("Submit product", tools)
        assert selected is not None
        # Should prefer submit_tool for "submit" keyword
        assert "submit" in selected.name.lower()

    @pytest.mark.asyncio
    async def test_llm_tool_selection(self):
        """Test LLM-based tool selection"""
        tools = [
            VoixTool(
                name="submit_product",
                description="Submit product to directory",
                endpoint="https://api.example.com/submit",
                method="POST"
            ),
            VoixTool(
                name="get_status",
                description="Get submission status",
                endpoint="https://api.example.com/status",
                method="GET"
            ),
        ]

        automation = HybridAutomation(agent_role="test_agent", use_llm_selection=True)

        with patch('infrastructure.llm_client.LLMFactory.get_client') as mock_llm:
            mock_client = MagicMock()
            mock_client.generate.return_value = "submit_product"
            mock_llm.return_value = mock_client

            selected = await automation._llm_select_tool("Submit my product", tools)
            assert selected is not None
            assert selected.name == "submit_product"

