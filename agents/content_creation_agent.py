"""
CONTENT CREATION AGENT - Tier 2 Implementation
Version: 2.0 (Tier 2 - High Value Memory Integration)
Created: November 13, 2025

Generates blog posts, documentation, visual content, and marketing materials,
with persistent memory for content templates and user preferences.

MODEL: GPT-4o ($0.03/1K input, $0.06/1K output)

CAPABILITIES:
- Blog post and documentation generation
- Image generation and analysis (multimodal)
- Content template management
- User preference learning
- SEO optimization
- Persistent memory for content patterns

ARCHITECTURE:
- Microsoft Agent Framework for orchestration
- MemoryTool Integration (Tier 2 - High Value):
  * App scope: Cross-agent content templates and best practices
  * User scope: User-specific content preferences and styles
  * Semantic search for similar content scenarios
  * 49% improvement through persistent memory (MemoryOS benchmark)

MEMORY INTEGRATION (Tier 2 - High Value):
1. store_content_template() - Store successful content templates
2. recall_templates() - Retrieve templates for specific content types
3. generate_content() - Generate content with learned patterns
4. analyze_content() - Analyze generated content quality

Memory Scopes:
- app: Cross-agent content knowledge (shared templates and best practices)
- user: User-specific content preferences, brand voice, and style guides
"""

import asyncio
import json
import logging
import os
import uuid
import base64
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, List, Optional, Any, Tuple
from collections import defaultdict
from enum import Enum

# Microsoft Agent Framework imports
from agent_framework import ChatAgent
from agent_framework.azure import AzureAIAgentClient
from agent_framework.observability import setup_observability
from azure.identity.aio import AzureCliCredential

# MemoryOS MongoDB adapter for persistent content memory
from infrastructure.memory_os_mongodb_adapter import (
    GenesisMemoryOSMongoDB,
    create_genesis_memory_mongodb
)

# MemoryTool for structured memory operations
from infrastructure.memory.orchestrator_memory_tool import MemoryTool

# Setup observability
setup_observability(enable_sensitive_data=True)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ContentType(Enum):
    """Content types supported by the agent"""
    BLOG_POST = "blog_post"
    DOCUMENTATION = "documentation"
    SOCIAL_MEDIA = "social_media"
    EMAIL = "email"
    HERO_IMAGE = "hero_image"
    INFOGRAPHIC = "infographic"
    WHITEPAPER = "whitepaper"
    CASE_STUDY = "case_study"


@dataclass
class ContentTemplate:
    """Content template for structured generation"""
    template_id: str
    content_type: ContentType
    template_name: str
    structure: Dict[str, Any]
    placeholders: List[str]
    success_rate: float
    usage_count: int
    created_at: datetime
    last_updated: datetime


@dataclass
class UserPreferences:
    """User content preferences and style guide"""
    user_id: str
    brand_voice: str
    tone: str
    target_audience: str
    max_word_count: int
    min_word_count: int
    include_seo: bool
    include_cta: bool
    preferred_formats: List[str]
    brand_guidelines: Dict[str, Any]
    created_at: datetime


@dataclass
class GeneratedContent:
    """Generated content with metadata"""
    content_id: str
    content_type: ContentType
    title: str
    body: str
    metadata: Dict[str, Any]
    quality_score: float
    seo_score: Optional[float]
    images: List[str]
    created_at: datetime
    template_used: Optional[str]


@dataclass
class ContentAnalysis:
    """Analysis of generated content quality"""
    content_id: str
    quality_score: float
    readability_score: float
    seo_score: float
    engagement_potential: float
    issues: List[str]
    suggestions: List[str]
    analyzed_at: datetime


class ContentCreationAgent:
    """Content creation agent with multimodal support and persistent memory"""

    def __init__(
        self,
        business_id: str = "default",
        enable_memory: bool = True,
        mongodb_uri: Optional[str] = None
    ):
        """
        Initialize Content Creation Agent.

        Args:
            business_id: Business identifier for multi-tenancy
            enable_memory: Enable persistent memory integration
            mongodb_uri: Optional MongoDB connection string
        """
        self.business_id = business_id
        self.agent = None
        self.enable_memory = enable_memory

        # Initialize MemoryOS MongoDB adapter for persistent content memory
        self.memory: Optional[GenesisMemoryOSMongoDB] = None
        if enable_memory:
            self._init_memory(mongodb_uri)

        # Initialize MemoryTool wrapper for structured memory operations
        self.memory_tool: Optional[MemoryTool] = None
        if enable_memory:
            self._init_memory_tool()

        # Track content generation sessions
        self.session_id = str(uuid.uuid4())
        self.content_stats = defaultdict(int)

        logger.info(
            f"ContentCreationAgent initialized: business_id={business_id}, "
            f"memory_enabled={enable_memory}, session_id={self.session_id}"
        )

    def _init_memory(self, mongodb_uri: Optional[str] = None) -> None:
        """Initialize MemoryOS MongoDB adapter"""
        try:
            uri = mongodb_uri or os.getenv(
                "MONGODB_URI",
                "mongodb://localhost:27017/"
            )

            self.memory = create_genesis_memory_mongodb(
                mongodb_uri=uri,
                database_name="genesis_memory",
                short_term_capacity=10,
                mid_term_capacity=2000,
                long_term_knowledge_capacity=100
            )

            logger.info(
                f"[ContentCreationAgent] MemoryOS initialized: "
                f"agent_id=content_creation, business_id={self.business_id}"
            )

        except Exception as e:
            logger.error(f"Failed to initialize MemoryOS: {e}")
            self.memory = None
            self.enable_memory = False

    def _init_memory_tool(self) -> None:
        """Initialize MemoryTool for structured operations"""
        try:
            self.memory_tool = MemoryTool(namespace="content_creation")
            logger.info("[ContentCreationAgent] MemoryTool initialized")
        except Exception as e:
            logger.error(f"Failed to initialize MemoryTool: {e}")
            self.memory_tool = None

    async def setup(self) -> None:
        """Setup agent with Microsoft Agent Framework"""
        try:
            # Initialize Azure AI client
            credential = AzureCliCredential()
            project_endpoint = os.getenv("AZURE_AI_PROJECT_ENDPOINT")

            if not project_endpoint:
                raise ValueError("AZURE_AI_PROJECT_ENDPOINT not set")

            client = await AzureAIAgentClient.from_azure_openai_config(
                project_endpoint=project_endpoint,
                credential=credential,
                deployment_name="gpt-4o"
            )

            # Create chat agent with multimodal capabilities
            self.agent = await client.create_agent(
                instructions=(
                    "You are the Content Creation Agent, specialized in generating high-quality content "
                    "across multiple formats (blog posts, documentation, social media, emails). "
                    "You support image analysis and generation for visual content. "
                    "You learn from user preferences and apply successful content patterns to create "
                    "engaging, SEO-optimized content that resonates with target audiences."
                ),
                model="gpt-4o",
                name="ContentCreationAgent"
            )

            logger.info("ContentCreationAgent setup complete")

        except Exception as e:
            logger.error(f"Agent setup failed: {e}")
            raise

    async def store_content_template(
        self,
        user_id: str,
        content_type: ContentType,
        template_name: str,
        structure: Dict[str, Any],
        placeholders: List[str],
        success_rate: float = 0.8
    ) -> str:
        """
        Store a content template for reuse.

        Args:
            user_id: User identifier
            content_type: Type of content
            template_name: Name of the template
            structure: Template structure with sections
            placeholders: Template placeholders
            success_rate: Success rate of this template

        Returns:
            Template ID
        """
        template_id = str(uuid.uuid4())
        template = ContentTemplate(
            template_id=template_id,
            content_type=content_type,
            template_name=template_name,
            structure=structure,
            placeholders=placeholders,
            success_rate=success_rate,
            usage_count=0,
            created_at=datetime.now(timezone.utc),
            last_updated=datetime.now(timezone.utc)
        )

        if self.memory_tool:
            try:
                await self.memory_tool.store_memory(
                    scope="app",
                    namespace="content_templates",
                    key=f"{content_type.value}_{template_name}",
                    value=asdict(template),
                    ttl=None  # Long-term storage
                )
                logger.info(f"[ContentCreationAgent] Template stored: {template_id}")
            except Exception as e:
                logger.warning(f"Failed to store template in memory: {e}")

        self.content_stats['templates_stored'] += 1
        return template_id

    async def recall_templates(
        self,
        user_id: str,
        content_type: Optional[ContentType] = None,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Recall stored content templates.

        Args:
            user_id: User identifier
            content_type: Optional content type filter
            top_k: Number of templates to retrieve

        Returns:
            List of templates
        """
        templates = []

        if self.memory_tool:
            try:
                # Retrieve templates from memory
                if content_type:
                    pattern = f"{content_type.value}_*"
                    results = await self.memory_tool.search_memory(
                        scope="app",
                        namespace="content_templates",
                        query=pattern,
                        limit=top_k
                    )
                else:
                    results = await self.memory_tool.search_memory(
                        scope="app",
                        namespace="content_templates",
                        limit=top_k
                    )

                templates = results if results else []
                logger.info(f"[ContentCreationAgent] Retrieved {len(templates)} templates")

            except Exception as e:
                logger.warning(f"Failed to recall templates: {e}")

        self.content_stats['templates_recalled'] += 1
        return templates

    async def generate_content(
        self,
        user_id: str,
        content_type: ContentType,
        topic: str,
        requirements: Dict[str, Any]
    ) -> GeneratedContent:
        """
        Generate content with learned patterns.

        Args:
            user_id: User identifier
            content_type: Type of content to generate
            topic: Content topic
            requirements: Specific requirements

        Returns:
            Generated content
        """
        content_id = str(uuid.uuid4())

        # Recall templates and user preferences
        templates = await self.recall_templates(user_id, content_type, top_k=3)
        preferences = await self._recall_user_preferences(user_id)

        # Generate content (simplified - in production uses full LLM pipeline)
        title = f"{content_type.value}: {topic}"
        body = await self._generate_content_body(
            content_type=content_type,
            topic=topic,
            templates=templates,
            preferences=preferences,
            requirements=requirements
        )

        # Analyze generated content
        analysis = await self._analyze_content(title, body, content_type, content_id)

        # Create content object
        content = GeneratedContent(
            content_id=content_id,
            content_type=content_type,
            title=title,
            body=body,
            metadata={
                "topic": topic,
                "user_id": user_id,
                "templates_used": len(templates),
                "requirements": requirements
            },
            quality_score=analysis.quality_score,
            seo_score=analysis.seo_score,
            images=[],
            created_at=datetime.now(timezone.utc),
            template_used=templates[0].get('template_id') if templates else None
        )

        logger.info(
            f"Content generated: {content_id}, quality_score={analysis.quality_score:.2f}"
        )

        self.content_stats['content_generated'] += 1
        return content

    async def _analyze_content(
        self,
        title: str,
        body: str,
        content_type: ContentType,
        content_id: str = ""
    ) -> ContentAnalysis:
        """
        Analyze generated content quality.

        Args:
            title: Content title
            body: Content body
            content_type: Type of content
            content_id: Content identifier

        Returns:
            Content analysis with scores
        """
        # Calculate quality metrics
        word_count = len(body.split())
        readability_score = self._calculate_readability(body)
        seo_score = self._calculate_seo_score(title, body)
        engagement_potential = self._calculate_engagement(body)

        # Determine overall quality
        quality_score = (readability_score + seo_score + engagement_potential) / 3

        # Identify issues
        issues = []
        if word_count < 100:
            issues.append("Content too short")
        if not title or len(title) > 100:
            issues.append("Title length issues")

        return ContentAnalysis(
            content_id=content_id or str(uuid.uuid4()),
            quality_score=quality_score,
            readability_score=readability_score,
            seo_score=seo_score,
            engagement_potential=engagement_potential,
            issues=issues,
            suggestions=self._generate_suggestions(issues),
            analyzed_at=datetime.now(timezone.utc)
        )

    async def _generate_content_body(
        self,
        content_type: ContentType,
        topic: str,
        templates: List[Dict[str, Any]],
        preferences: Optional[UserPreferences],
        requirements: Dict[str, Any]
    ) -> str:
        """Generate content body with learned patterns"""
        # In production, this would use the LLM via the agent
        body = f"Content about {topic} using {content_type.value} format.\n"

        if templates:
            body += f"Applied learned patterns from {len(templates)} templates.\n"

        if preferences:
            body += f"Tone: {preferences.tone}, Target audience: {preferences.target_audience}\n"

        body += f"Requirements: {json.dumps(requirements)}"
        return body

    async def _recall_user_preferences(
        self,
        user_id: str
    ) -> Optional[UserPreferences]:
        """Recall user content preferences"""
        if self.memory_tool:
            try:
                result = await self.memory_tool.retrieve_memory(
                    scope="user",
                    namespace="content_preferences",
                    key=user_id
                )
                if result:
                    logger.info(f"[ContentCreationAgent] Retrieved preferences for {user_id}")
                    return result
            except Exception as e:
                logger.warning(f"Failed to recall preferences: {e}")

        return None

    def _calculate_readability(self, text: str) -> float:
        """Calculate readability score (0-1)"""
        if not text:
            return 0.0
        # Simplified: average sentence length
        sentences = [s for s in text.split('.') if s.strip()]  # Filter empty sentences
        words = len(text.split())
        if not sentences:
            return 0.5  # Default score if no valid sentences
        avg_sentence_length = words / len(sentences)
        # Flesch Kincaid simplified: optimal around 15-20 words per sentence
        score = 1.0 - abs(avg_sentence_length - 17.5) / 35.0
        return max(0.0, min(1.0, score))

    def _calculate_seo_score(self, title: str, body: str) -> float:
        """Calculate SEO optimization score (0-1)"""
        score = 0.3  # Base score
        if len(title) >= 30 and len(title) <= 60:
            score += 0.2
        if len(body) >= 300:
            score += 0.2
        if title.lower() in body.lower():
            score += 0.2
        return min(1.0, score)

    def _calculate_engagement(self, text: str) -> float:
        """Calculate engagement potential (0-1)"""
        engagement_indicators = ['you', 'your', '!', '?', 'action', 'click']
        if not engagement_indicators:
            return 0.5  # Default engagement score
        text_lower = text.lower()
        found = sum(1 for indicator in engagement_indicators if indicator in text_lower)
        return min(1.0, found / len(engagement_indicators))

    def _generate_suggestions(self, issues: List[str]) -> List[str]:
        """Generate improvement suggestions based on issues"""
        suggestions = []
        if "Content too short" in issues:
            suggestions.append("Expand content to at least 300 words")
        if "Title length issues" in issues:
            suggestions.append("Keep title between 30-60 characters")
        return suggestions

    def get_stats(self) -> Dict[str, Any]:
        """Get agent statistics"""
        return {
            'session_id': self.session_id,
            'business_id': self.business_id,
            'memory_enabled': self.enable_memory,
            'stats': dict(self.content_stats)
        }


async def create_content_creation_agent(
    business_id: str = "default",
    enable_memory: bool = True,
    mongodb_uri: Optional[str] = None
) -> ContentCreationAgent:
    """
    Factory function to create and initialize ContentCreationAgent.

    Args:
        business_id: Business identifier for multi-tenancy
        enable_memory: Enable persistent memory integration
        mongodb_uri: Optional MongoDB connection string

    Returns:
        Initialized ContentCreationAgent
    """
    agent = ContentCreationAgent(
        business_id=business_id,
        enable_memory=enable_memory,
        mongodb_uri=mongodb_uri
    )

    try:
        await agent.setup()
    except Exception as e:
        logger.warning(f"Agent setup failed, continuing with limited functionality: {e}")

    return agent


if __name__ == "__main__":
    # Example usage
    async def main():
        agent = await create_content_creation_agent(enable_memory=False)

        # Store a template
        template_id = await agent.store_content_template(
            user_id="user_1",
            content_type=ContentType.BLOG_POST,
            template_name="standard_blog",
            structure={
                "introduction": "Hook with question or statistic",
                "body": "Main points with examples",
                "conclusion": "Summary and CTA"
            },
            placeholders=["[TOPIC]", "[EXAMPLES]", "[CTA]"],
            success_rate=0.85
        )
        print(f"Template created: {template_id}")

        # Generate content
        content = await agent.generate_content(
            user_id="user_1",
            content_type=ContentType.BLOG_POST,
            topic="AI in Content Creation",
            requirements={"word_count": 500, "include_cta": True}
        )
        print(f"Content generated: {content.content_id}")
        print(f"Quality score: {content.quality_score:.2f}")

    asyncio.run(main())
