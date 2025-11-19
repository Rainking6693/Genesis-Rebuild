"""
Integration tests for hybrid automation
"""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from infrastructure.browser_automation.hybrid_automation import HybridAutomation, AutomationResult
from infrastructure.browser_automation.voix_detector import VoixTool


class TestHybridAutomationIntegration:
    """Integration tests for hybrid automation"""

    @pytest.mark.asyncio
    async def test_voix_enabled_sample_sites(self):
        """Test VOIX-enabled sample sites"""
        automation = HybridAutomation(agent_role="test_agent")

        # Mock VOIX tool detection
        tool = VoixTool(
            name="submit_form",
            description="Submit product form",
            endpoint="https://api.example.com/submit",
            method="POST",
            parameters={
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "url": {"type": "string"}
                }
            }
        )

        with patch.object(automation, 'detect_voix_tools', return_value=[tool]):
            with patch.object(automation, 'execute_via_voix') as mock_execute:
                mock_execute.return_value = AutomationResult(
                    success=True,
                    method="voix",
                    result={"id": "123", "url": "https://example.com/submission/123"},
                    execution_time_ms=50.0
                )

                result = await automation.navigate_and_act(
                    "https://example.com/submit",
                    "Submit product"
                )

                assert result.method == "voix"
                assert result.success is True
                assert result.execution_time_ms < 100  # VOIX should be fast

    @pytest.mark.asyncio
    async def test_non_voix_sites_fallback(self):
        """Test non-VOIX sites fallback to Skyvern/Gemini Computer Use"""
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
                    "https://example.com/no-voix",
                    "Perform action"
                )

                assert result.method == "fallback"
                assert result.success is True

    @pytest.mark.asyncio
    async def test_mixed_sites_partial_voix_support(self):
        """Test mixed sites with partial VOIX support"""
        automation = HybridAutomation(agent_role="test_agent")

        # Some tools available but not all
        tool = VoixTool(
            name="get_data",
            description="Get data",
            endpoint="https://api.example.com/data",
            method="GET"
        )

        with patch.object(automation, 'detect_voix_tools', return_value=[tool]):
            with patch.object(automation, 'execute_via_voix') as mock_voix:
                mock_voix.return_value = AutomationResult(
                    success=True,
                    method="voix",
                    result={"data": "test"},
                    execution_time_ms=30.0
                )

                result = await automation.navigate_and_act(
                    "https://example.com/mixed",
                    "Get data"
                )

                assert result.method == "voix"
                assert result.success is True

    @pytest.mark.asyncio
    async def test_dynamic_content_updates(self):
        """Test dynamic content updates via MutationObserver"""
        automation = HybridAutomation(agent_role="test_agent")

        # Simulate dynamic tool addition
        tools_initial = []
        tools_after_update = [
            VoixTool(
                name="dynamic_tool",
                description="Dynamically added tool",
                endpoint="https://api.example.com/dynamic",
                method="POST"
            )
        ]

        with patch.object(automation, 'detect_voix_tools') as mock_detect:
            mock_detect.side_effect = [tools_initial, tools_after_update]

            # First check - no tools
            result1 = await automation.navigate_and_act(
                "https://example.com/dynamic",
                "Check for tools"
            )

            # Second check - tools available
            result2 = await automation.navigate_and_act(
                "https://example.com/dynamic",
                "Use dynamic tool"
            )

            # Verify detection was called multiple times
            assert mock_detect.call_count >= 2

    @pytest.mark.asyncio
    async def test_error_handling_and_recovery(self):
        """Test error handling and recovery"""
        automation = HybridAutomation(agent_role="test_agent")

        tool = VoixTool(
            name="error_tool",
            description="Tool that fails",
            endpoint="https://api.example.com/error",
            method="POST"
        )

        with patch.object(automation, 'detect_voix_tools', return_value=[tool]):
            with patch.object(automation, 'execute_via_voix') as mock_execute:
                # First attempt fails
                mock_execute.side_effect = [
                    AutomationResult(
                        success=False,
                        method="voix",
                        result=None,
                        error="Network error",
                        execution_time_ms=100.0
                    ),
                    # Fallback succeeds
                    AutomationResult(
                        success=True,
                        method="fallback",
                        result={"success": True},
                        execution_time_ms=200.0
                    )
                ]

                # Should fallback on error
                with patch.object(automation, 'execute_via_fallback') as mock_fallback:
                    mock_fallback.return_value = AutomationResult(
                        success=True,
                        method="fallback",
                        result={"success": True},
                        execution_time_ms=200.0
                    )

                    result = await automation.navigate_and_act(
                        "https://example.com/error",
                        "Handle error"
                    )

                    # Should eventually succeed via fallback
                    assert result.success is True

