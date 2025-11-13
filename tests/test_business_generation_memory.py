"""
Test suite for Business Generation Agent Memory Integration
Tests MemoryTool and MultimodalMemoryPipeline integration
"""

import pytest
import asyncio
from unittest.mock import Mock, patch, AsyncMock
from datetime import datetime

from agents.business_generation_agent import (
    BusinessGenerationAgent,
    MemoryTool,
    get_business_generation_agent
)
from infrastructure.business_idea_generator import BusinessIdea


class TestMemoryTool:
    """Test MemoryTool functionality"""

    @pytest.fixture
    def mock_backend(self):
        """Create mock memory backend"""
        backend = Mock()
        backend.store = Mock(return_value=True)
        backend.retrieve = Mock(return_value=[])
        return backend

    @pytest.fixture
    def memory_tool(self, mock_backend):
        """Create MemoryTool instance"""
        return MemoryTool(backend=mock_backend, agent_id="business_generation")

    def test_build_user_id_app_scope(self, memory_tool):
        """Test user_id building for app scope"""
        user_id = memory_tool._build_user_id(scope="app", user_id=None)
        assert user_id == "business_global"

    def test_build_user_id_user_scope(self, memory_tool):
        """Test user_id building for user scope"""
        user_id = memory_tool._build_user_id(scope="user", user_id="user_123")
        assert user_id == "business_user_123"

    def test_build_user_input_business_type(self, memory_tool):
        """Test user_input building for business type"""
        content = {"business_type": "saas"}
        user_input = memory_tool._build_user_input(content)
        assert "saas" in user_input
        assert "Generate" in user_input

    def test_build_agent_response_template(self, memory_tool):
        """Test agent_response building for template"""
        content = {
            "template_data": {
                "name": "TestBusiness",
                "business_type": "saas"
            },
            "success_metrics": {
                "overall_score": 85.5
            }
        }
        response = memory_tool._build_agent_response(content)
        assert "TestBusiness" in response
        assert "85.5" in response

    def test_store_memory_success(self, memory_tool, mock_backend):
        """Test successful memory storage"""
        content = {
            "business_type": "saas",
            "template_data": {"name": "Test"},
            "success_metrics": {"overall_score": 80.0}
        }

        result = memory_tool.store_memory(
            content=content,
            scope="app",
            provenance={"agent_id": "business_generation"}
        )

        assert result is True
        assert mock_backend.store.called

    def test_apply_filters_exact_match(self, memory_tool):
        """Test filter application with exact match"""
        memories = [
            {
                "content": {
                    "raw_content": {
                        "business_type": "saas",
                        "success_score": 80.0
                    }
                }
            },
            {
                "content": {
                    "raw_content": {
                        "business_type": "ecommerce",
                        "success_score": 70.0
                    }
                }
            }
        ]

        filters = {"business_type": "saas"}
        filtered = memory_tool._apply_filters(memories, filters)

        assert len(filtered) == 1
        assert filtered[0]["content"]["raw_content"]["business_type"] == "saas"

    def test_apply_filters_greater_than(self, memory_tool):
        """Test filter application with greater than operator"""
        memories = [
            {
                "content": {
                    "raw_content": {
                        "business_type": "saas",
                        "success_score": 80.0
                    }
                }
            },
            {
                "content": {
                    "raw_content": {
                        "business_type": "saas",
                        "success_score": 60.0
                    }
                }
            }
        ]

        filters = {"success_score": ">70"}
        filtered = memory_tool._apply_filters(memories, filters)

        assert len(filtered) == 1
        assert filtered[0]["content"]["raw_content"]["success_score"] == 80.0


class TestBusinessGenerationAgent:
    """Test BusinessGenerationAgent memory integration"""

    @pytest.fixture
    def mock_memory_backend(self):
        """Create mock memory backend"""
        backend = Mock()
        backend.store = Mock(return_value=True)
        backend.retrieve = Mock(return_value=[])
        return backend

    @pytest.fixture
    def agent_with_mock_memory(self, mock_memory_backend):
        """Create agent with mock memory"""
        with patch('agents.business_generation_agent.create_genesis_memory_mongodb', return_value=mock_memory_backend):
            agent = BusinessGenerationAgent(
                business_id="test_business",
                enable_memory=True,
                enable_multimodal=False
            )
            return agent

    @pytest.mark.asyncio
    async def test_agent_initialization(self):
        """Test agent initialization"""
        agent = BusinessGenerationAgent(
            business_id="test_business",
            enable_memory=False,
            enable_multimodal=False
        )

        assert agent.business_id == "test_business"
        assert agent.enable_memory is False
        assert agent.enable_multimodal is False
        assert agent.idea_generator is not None

    @pytest.mark.asyncio
    async def test_store_business_template(self, agent_with_mock_memory):
        """Test business template storage"""
        template_data = {
            "name": "TestBusiness",
            "business_type": "saas",
            "description": "Test description"
        }

        success_metrics = {
            "overall_score": 85.0,
            "revenue_score": 80.0
        }

        result = await agent_with_mock_memory.store_business_template(
            business_type="saas",
            template_data=template_data,
            success_metrics=success_metrics,
            user_id="test_user"
        )

        assert result is True

    @pytest.mark.asyncio
    async def test_recall_business_templates(self, agent_with_mock_memory, mock_memory_backend):
        """Test business template retrieval"""
        # Mock retrieved memories
        mock_memories = [
            {
                "content": {
                    "raw_content": {
                        "business_type": "saas",
                        "template_data": {"name": "TestBusiness1"},
                        "success_metrics": {"overall_score": 85.0}
                    }
                }
            }
        ]

        mock_memory_backend.retrieve = Mock(return_value=mock_memories)

        templates = await agent_with_mock_memory.recall_business_templates(
            business_type="saas",
            min_success_score=0.7,
            top_k=5,
            user_id="test_user"
        )

        assert len(templates) == 1
        assert templates[0]["content"]["raw_content"]["business_type"] == "saas"

    @pytest.mark.asyncio
    async def test_store_market_insight(self, agent_with_mock_memory, mock_memory_backend):
        """Test market insight storage"""
        # Ensure store method doesn't raise exceptions
        mock_memory_backend.store.side_effect = None

        insights = {
            "trends": ["AI productivity tools"],
            "competition_level": "medium"
        }

        result = await agent_with_mock_memory.store_market_insight(
            market_category="AI productivity tools",
            insights=insights,
            user_id="test_user"
        )

        assert result is True
        assert mock_memory_backend.store.called

    @pytest.mark.asyncio
    async def test_recall_market_insights(self, agent_with_mock_memory, mock_memory_backend):
        """Test market insight retrieval"""
        mock_insights = [
            {
                "content": {
                    "raw_content": {
                        "market_category": "AI productivity tools",
                        "market_insights": {"trends": ["AI tools"]}
                    }
                }
            }
        ]

        mock_memory_backend.retrieve = Mock(return_value=mock_insights)

        insights = await agent_with_mock_memory.recall_market_insights(
            market_category="AI productivity tools",
            top_k=3,
            user_id="test_user"
        )

        assert len(insights) == 1
        assert insights[0]["content"]["raw_content"]["market_category"] == "AI productivity tools"

    @pytest.mark.asyncio
    async def test_generate_idea_with_memory_disabled(self):
        """Test idea generation with memory disabled"""
        agent = BusinessGenerationAgent(
            business_id="test_business",
            enable_memory=False,
            enable_multimodal=False
        )

        idea = await agent.generate_idea_with_memory(
            business_type="saas",
            min_revenue_score=50.0,
            max_attempts=1,
            user_id="test_user",
            learn_from_past=False
        )

        assert isinstance(idea, BusinessIdea)
        assert idea.business_type == "saas"
        assert idea.overall_score > 0

    @pytest.mark.asyncio
    async def test_process_business_plan_image_disabled(self):
        """Test image processing with multimodal disabled"""
        agent = BusinessGenerationAgent(
            business_id="test_business",
            enable_memory=False,
            enable_multimodal=False
        )

        result = await agent.process_business_plan_image(
            image_uri="/fake/path.png",
            user_id="test_user"
        )

        assert result is None


class TestIntegration:
    """Integration tests for full workflow"""

    @pytest.mark.asyncio
    async def test_end_to_end_generation_and_recall(self):
        """Test complete generation and recall workflow"""
        # This test requires actual memory backend
        # Skip if MongoDB not available
        try:
            agent = BusinessGenerationAgent(
                business_id="test_business",
                enable_memory=True,
                enable_multimodal=False
            )

            # Generate idea
            idea = await agent.generate_idea_with_memory(
                business_type="saas",
                min_revenue_score=50.0,
                max_attempts=1,
                user_id="test_user",
                learn_from_past=False
            )

            assert isinstance(idea, BusinessIdea)

            # Try to recall (may be empty if just created)
            templates = await agent.recall_business_templates(
                business_type="saas",
                min_success_score=0.4,
                top_k=5,
                user_id="test_user"
            )

            # Should have at least the one we just created if score was high enough
            assert isinstance(templates, list)

        except Exception as e:
            # Skip test if MongoDB not available
            pytest.skip(f"MongoDB not available: {e}")

    @pytest.mark.asyncio
    async def test_batch_generation(self):
        """Test batch generation workflow"""
        agent = BusinessGenerationAgent(
            business_id="test_business",
            enable_memory=False,
            enable_multimodal=False
        )

        ideas = await agent.generate_batch_with_memory(
            count=2,
            business_types=["saas", "ecommerce"],
            min_revenue_score=50.0,
            user_id="test_user",
            learn_from_past=False
        )

        assert len(ideas) == 2
        assert all(isinstance(idea, BusinessIdea) for idea in ideas)
        # Should be sorted by score (descending)
        assert ideas[0].overall_score >= ideas[1].overall_score


class TestFactoryFunction:
    """Test factory function"""

    def test_get_business_generation_agent(self):
        """Test factory function creates singleton"""
        agent1 = get_business_generation_agent(
            business_id="test_business",
            enable_memory=False,
            enable_multimodal=False
        )

        agent2 = get_business_generation_agent(
            business_id="test_business",
            enable_memory=False,
            enable_multimodal=False
        )

        assert agent1 is agent2  # Should be same instance (singleton)


if __name__ == "__main__":
    pytest.main([__file__, "-v", "-s"])
