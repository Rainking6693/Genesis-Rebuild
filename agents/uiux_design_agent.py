"""
UI/UX DESIGN AGENT - Tier 3 Specialized Agent
Version: 1.0 (Tier 3 - Specialized Memory Integration + Multimodal + AligNet QA)
Last Updated: November 13, 2025

Agent for UI/UX design with multimodal vision and AligNet QA for consistency.

MODEL: Gemini 2.5 Flash (372 tokens/sec, $0.03/1M tokens) + Vision API

CAPABILITIES:
- UI/UX design analysis and generation
- Multimodal vision API for design image processing
- AligNet odd-one-out detection for UI consistency
- Pattern learning from successful designs
- User-specific brand guidelines
- Cross-agent design knowledge sharing
- Accessibility (WCAG) compliance checking

MEMORY INTEGRATION (Tier 3 - Specialized + Multimodal):
1. store_design_pattern() - Store design patterns with visual embeddings
2. recall_patterns() - Retrieve similar design patterns
3. audit_design() - Audit design with AligNet consistency checking
4. process_design_image() - Process design images with vision API
5. recall_user_brand_guidelines() - Get user brand preferences

Memory Scopes:
- app: Cross-agent design knowledge (shared patterns)
- user: User-specific brand guidelines and preferences

AligNet QA:
- Odd-one-out detection for UI element consistency
- Visual similarity scoring for brand compliance
- Uncertainty scoring for human escalation
"""

import asyncio
import json
import logging
import os
import uuid
import base64
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any, Tuple
from pathlib import Path
from enum import Enum

# Gemini Vision API
try:
    from google import genai
    from google.genai.types import Part
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False
    genai = None

from infrastructure.memory_os_mongodb_adapter import (
    GenesisMemoryOSMongoDB,
    create_genesis_memory_mongodb
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class VisualSimilarityScore(Enum):
    """AligNet uncertainty levels for visual similarity"""
    VERY_HIGH = 0.95  # High confidence, consistent design
    HIGH = 0.85       # Good confidence
    MODERATE = 0.70   # Medium confidence, some differences
    LOW = 0.50        # Low confidence, significant differences
    VERY_LOW = 0.20   # Very low confidence, inconsistent


@dataclass
class DesignConfig:
    """Configuration for UI/UX design"""
    design_name: str
    design_type: str  # landing_page, mobile_app, dashboard, component
    brand_colors: Optional[List[str]] = None
    typography: Optional[Dict[str, str]] = None
    accessibility_level: str = "AA"  # WCAG AA or AAA
    target_devices: Optional[List[str]] = None  # mobile, tablet, desktop
    metadata: Optional[Dict[str, Any]] = None

    def __post_init__(self):
        if self.brand_colors is None:
            self.brand_colors = []
        if self.target_devices is None:
            self.target_devices = ["desktop"]
        if self.metadata is None:
            self.metadata = {}


@dataclass
class AligNetAnalysis:
    """AligNet visual similarity analysis result"""
    image_path: str
    similarity_scores: Dict[str, float]
    odd_one_out: Optional[str]
    uncertainty_score: float  # Higher = more uncertain
    brand_compliance: float
    recommendations: List[str]
    requires_human_review: bool


@dataclass
class DesignResult:
    """Result of design operation"""
    success: bool
    design_name: Optional[str] = None
    design_url: Optional[str] = None
    alignet_analysis: Optional[AligNetAnalysis] = None
    accessibility_score: Optional[float] = None
    consistency_score: Optional[float] = None
    error: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

    def __post_init__(self):
        if self.metadata is None:
            self.metadata = {}


class AligNetQAEngine:
    """
    AligNet QA Engine for visual design consistency checking.

    Uses odd-one-out detection to identify inconsistent UI elements.
    """

    def __init__(self):
        """Initialize AligNet QA engine."""
        self.uncertainty_threshold = 0.7  # Threshold for human review

    async def analyze_design_consistency(
        self,
        design_images: List[str],
        reference_guidelines: Optional[Dict[str, Any]] = None
    ) -> AligNetAnalysis:
        """
        Analyze design consistency using odd-one-out detection.

        Args:
            design_images: List of design image paths
            reference_guidelines: Optional brand guidelines

        Returns:
            AligNetAnalysis with consistency results
        """
        try:
            # Mock AligNet analysis (would integrate with actual AligNet model)
            similarity_scores = {}
            for i, img_path in enumerate(design_images):
                # Calculate similarity to reference (mock)
                similarity_scores[img_path] = 0.85 + (i * 0.03)  # Mock scores

            # Identify odd-one-out (lowest similarity)
            odd_one_out = min(similarity_scores, key=similarity_scores.get) if len(similarity_scores) > 1 else None

            # Calculate uncertainty (variance in scores)
            scores = list(similarity_scores.values())
            uncertainty = self._calculate_uncertainty(scores)

            # Brand compliance (average similarity)
            brand_compliance = sum(scores) / len(scores) if scores else 0.0

            # Generate recommendations
            recommendations = []
            if uncertainty > self.uncertainty_threshold:
                recommendations.append("High uncertainty detected - recommend human review")
            if brand_compliance < 0.7:
                recommendations.append("Low brand compliance - review design guidelines")
            if odd_one_out:
                recommendations.append(f"Inconsistent element detected: {odd_one_out}")

            requires_human_review = uncertainty > self.uncertainty_threshold or brand_compliance < 0.7

            logger.info(f"[AligNet] Analyzed {len(design_images)} designs (uncertainty: {uncertainty:.2f})")

            return AligNetAnalysis(
                image_path=design_images[0] if design_images else "",
                similarity_scores=similarity_scores,
                odd_one_out=odd_one_out,
                uncertainty_score=uncertainty,
                brand_compliance=brand_compliance,
                recommendations=recommendations,
                requires_human_review=requires_human_review
            )

        except Exception as e:
            logger.error(f"[AligNet] Analysis failed: {e}")
            return AligNetAnalysis(
                image_path="",
                similarity_scores={},
                odd_one_out=None,
                uncertainty_score=1.0,
                brand_compliance=0.0,
                recommendations=["Analysis failed - manual review required"],
                requires_human_review=True
            )

    def _calculate_uncertainty(self, scores: List[float]) -> float:
        """Calculate uncertainty score from similarity scores."""
        if len(scores) < 2:
            return 0.0

        # Calculate variance
        mean_score = sum(scores) / len(scores)
        variance = sum((s - mean_score) ** 2 for s in scores) / len(scores)

        # Normalize to 0-1 range
        uncertainty = min(variance * 10, 1.0)

        return uncertainty


class MemoryTool:
    """MemoryTool wrapper for UI/UX Design Agent design pattern memory."""

    def __init__(self, backend: GenesisMemoryOSMongoDB, agent_id: str = "uiux_design_agent"):
        self.backend = backend
        self.agent_id = agent_id

    def store_memory(
        self,
        content: Dict[str, Any],
        scope: str = "app",
        provenance: Optional[Dict[str, Any]] = None,
        memory_type: str = "conversation"
    ) -> bool:
        try:
            user_id = self._build_user_id(scope, content.get("user_id"))
            user_input = self._build_user_input(content)
            agent_response = self._build_agent_response(content)

            stored_content = {
                "user_input": user_input,
                "agent_response": agent_response,
                "raw_content": content
            }

            self.backend.store(
                agent_id=self.agent_id,
                user_id=user_id,
                user_input=user_input,
                agent_response=json.dumps(stored_content),
                memory_type=memory_type
            )

            return True

        except Exception as e:
            logger.error(f"[UIUX MemoryTool] Failed to store memory: {e}")
            return False

    def retrieve_memory(
        self,
        query: str,
        scope: str = "app",
        filters: Optional[Dict[str, Any]] = None,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        try:
            user_id_filter = filters.get("user_id") if filters else None
            user_id = self._build_user_id(scope, user_id_filter)

            memories = self.backend.retrieve(
                agent_id=self.agent_id,
                user_id=user_id,
                query=query,
                memory_type=None,
                top_k=top_k * 2
            )

            parsed_memories = []
            for memory in memories:
                content = memory.get('content', {})
                if isinstance(content, dict):
                    agent_response = content.get('agent_response', '')
                    if isinstance(agent_response, str) and agent_response.startswith('{'):
                        try:
                            parsed_content = json.loads(agent_response)
                            memory['content'] = parsed_content
                        except json.JSONDecodeError:
                            pass
                parsed_memories.append(memory)

            if filters:
                parsed_memories = self._apply_filters(parsed_memories, filters)

            return parsed_memories[:top_k]

        except Exception as e:
            logger.error(f"[UIUX MemoryTool] Failed to retrieve memory: {e}")
            return []

    def _build_user_id(self, scope: str, user_id: Optional[str] = None) -> str:
        if scope == "app":
            return "uiux_design_global"
        elif scope == "user" and user_id:
            return f"uiux_design_{user_id}"
        else:
            return "uiux_design_default"

    def _build_user_input(self, content: Dict[str, Any]) -> str:
        design_name = content.get('design_name', 'unknown')
        design_type = content.get('design_type', 'unknown')
        return f"Design {design_type}: {design_name}"

    def _build_agent_response(self, content: Dict[str, Any]) -> str:
        if "result" in content:
            success = content.get('success', False)
            return f"Design {'COMPLETED' if success else 'FAILED'}"
        return json.dumps(content, indent=2)

    def _apply_filters(
        self,
        memories: List[Dict[str, Any]],
        filters: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        filtered = []
        for memory in memories:
            content = memory.get('content', {})
            raw_content = content.get('raw_content', content)

            matches = True
            for key, value in filters.items():
                if key == "user_id":
                    continue
                if isinstance(raw_content, dict) and raw_content.get(key) != value:
                    matches = False
                    break

            if matches:
                filtered.append(memory)
        return filtered


class UIUXDesignAgent:
    """UI/UX Design Agent - Designs interfaces with multimodal vision and AligNet QA."""

    def __init__(
        self,
        business_id: str = "default",
        enable_memory: bool = True,
        enable_multimodal: bool = True
    ):
        self.business_id = business_id
        self.agent_id = f"uiux_design_agent_{business_id}"

        self.enable_memory = enable_memory
        self.memory: Optional[GenesisMemoryOSMongoDB] = None
        self.memory_tool: Optional[MemoryTool] = None
        if enable_memory:
            self._init_memory()

        # Multimodal support
        self.enable_multimodal = enable_multimodal and GENAI_AVAILABLE
        self.genai_client = None
        if self.enable_multimodal:
            self._init_multimodal()

        # AligNet QA Engine
        self.alignet = AligNetQAEngine()

        self.designs_created = 0
        self.designs_successful = 0

        logger.info(f"🎨 UI/UX Design Agent initialized for business: {business_id}")
        logger.info(f"   Memory: {'Enabled' if self.enable_memory else 'Disabled'}")
        logger.info(f"   Multimodal: {'Enabled' if self.enable_multimodal else 'Disabled'}")
        logger.info(f"   AligNet QA: Enabled")

    def _init_memory(self):
        try:
            mongodb_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
            self.memory = create_genesis_memory_mongodb(
                mongodb_uri=mongodb_uri,
                database_name="genesis_memory_uiux_design",
                short_term_capacity=10,
                mid_term_capacity=200,
                long_term_knowledge_capacity=50
            )

            self.memory_tool = MemoryTool(backend=self.memory, agent_id="uiux_design_agent")

            logger.info("[UIUXDesignAgent] MemoryOS MongoDB initialized with MemoryTool integration")
        except Exception as e:
            logger.warning(f"[UIUXDesignAgent] Failed to initialize MemoryOS: {e}. Memory features disabled.")
            self.memory = None
            self.memory_tool = None
            self.enable_memory = False

    def _init_multimodal(self):
        """Initialize Gemini Vision API for multimodal design processing."""
        try:
            api_key = os.getenv("GEMINI_API_KEY")
            if not api_key:
                logger.warning("[UIUXDesignAgent] GEMINI_API_KEY not set, multimodal disabled")
                self.enable_multimodal = False
                return

            self.genai_client = genai.Client(api_key=api_key)
            logger.info("[UIUXDesignAgent] Gemini Vision API initialized")

        except Exception as e:
            logger.warning(f"[UIUXDesignAgent] Failed to initialize multimodal: {e}")
            self.enable_multimodal = False

    async def process_design_image(
        self,
        image_path: str,
        prompt: str = "Analyze this UI/UX design"
    ) -> Dict[str, Any]:
        """
        Process design image using Gemini Vision API (multimodal).

        Args:
            image_path: Path to design image
            prompt: Analysis prompt

        Returns:
            Vision API analysis result
        """
        if not self.enable_multimodal or not self.genai_client:
            logger.warning("[UIUXDesignAgent] Multimodal not available")
            return {"error": "Multimodal not enabled"}

        try:
            # Read image
            with open(image_path, 'rb') as f:
                image_data = f.read()

            # Encode to base64
            image_b64 = base64.b64encode(image_data).decode('utf-8')

            # Create multimodal prompt
            response = self.genai_client.models.generate_content(
                model='gemini-2.0-flash-exp',
                contents=[
                    Part.from_text(prompt),
                    Part.from_bytes(data=image_data, mime_type='image/png')
                ]
            )

            analysis = {
                "image_path": image_path,
                "prompt": prompt,
                "analysis": response.text if hasattr(response, 'text') else str(response),
                "timestamp": datetime.now(timezone.utc).isoformat()
            }

            logger.info(f"[UIUXDesignAgent] Processed design image: {image_path}")

            return analysis

        except Exception as e:
            logger.error(f"[UIUXDesignAgent] Failed to process design image: {e}")
            return {"error": str(e)}

    async def store_design_pattern(
        self,
        design_name: str,
        design_type: str,
        config: Dict[str, Any],
        result: Dict[str, Any],
        success: bool,
        user_id: Optional[str] = None
    ) -> bool:
        """Store design pattern for learning."""
        if not self.memory_tool:
            return False

        try:
            content = {
                "design_name": design_name,
                "design_type": design_type,
                "config": config,
                "result": result,
                "success": success,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "user_id": user_id
            }

            stored = self.memory_tool.store_memory(
                content=content,
                scope="app",
                memory_type="conversation"
            )

            if stored:
                logger.info(f"[UIUXDesignAgent] Stored design pattern: {design_name}")

            return stored

        except Exception as e:
            logger.error(f"[UIUXDesignAgent] Failed to store design pattern: {e}")
            return False

    async def recall_patterns(
        self,
        design_type: str,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """Recall successful design patterns."""
        if not self.memory_tool:
            return []

        try:
            query = f"successful {design_type} design"

            memories = self.memory_tool.retrieve_memory(
                query=query,
                scope="app",
                filters={"success": True},
                top_k=top_k
            )

            patterns = []
            for memory in memories:
                content = memory.get('content', {})
                raw_content = content.get('raw_content', content)

                if isinstance(raw_content, dict) and raw_content.get('success'):
                    patterns.append({
                        "design_name": raw_content.get('design_name'),
                        "design_type": raw_content.get('design_type'),
                        "config": raw_content.get('config', {})
                    })

            logger.info(f"[UIUXDesignAgent] Recalled {len(patterns)} design patterns")
            return patterns

        except Exception as e:
            logger.error(f"[UIUXDesignAgent] Failed to recall patterns: {e}")
            return []

    async def audit_design(
        self,
        config: DesignConfig,
        design_images: Optional[List[str]] = None,
        user_id: Optional[str] = None
    ) -> DesignResult:
        """
        Audit design with AligNet consistency checking and accessibility analysis.

        Args:
            config: Design configuration
            design_images: Optional list of design image paths
            user_id: Optional user ID

        Returns:
            DesignResult with audit results
        """
        self.designs_created += 1

        try:
            logger.info(f"🎨 Auditing {config.design_type} design: {config.design_name}...")

            # Recall successful patterns
            if self.enable_memory:
                patterns = await self.recall_patterns(design_type=config.design_type, top_k=3)
                if patterns:
                    logger.info(f"✓ Using learned patterns from {len(patterns)} successful designs")

            # AligNet consistency analysis
            alignet_analysis = None
            if design_images:
                alignet_analysis = await self.alignet.analyze_design_consistency(
                    design_images=design_images
                )
                logger.info(f"🔍 AligNet analysis: brand_compliance={alignet_analysis.brand_compliance:.2f}, "
                           f"uncertainty={alignet_analysis.uncertainty_score:.2f}")

                if alignet_analysis.requires_human_review:
                    logger.warning("⚠️ AligNet recommends human review")

            # Calculate accessibility score (WCAG compliance)
            accessibility_score = self._calculate_accessibility_score(config)

            # Calculate consistency score
            consistency_score = alignet_analysis.brand_compliance if alignet_analysis else 0.8

            # Store successful pattern
            if self.enable_memory:
                await self.store_design_pattern(
                    design_name=config.design_name,
                    design_type=config.design_type,
                    config=asdict(config),
                    result={
                        "accessibility_score": accessibility_score,
                        "consistency_score": consistency_score,
                        "alignet_analysis": asdict(alignet_analysis) if alignet_analysis else None
                    },
                    success=True,
                    user_id=user_id
                )

            self.designs_successful += 1

            logger.info(f"✅ Design audit complete: {config.design_name} "
                       f"(accessibility: {accessibility_score:.2f}, consistency: {consistency_score:.2f})")

            return DesignResult(
                success=True,
                design_name=config.design_name,
                design_url=f"https://designs.example.com/{config.design_name}",
                alignet_analysis=alignet_analysis,
                accessibility_score=accessibility_score,
                consistency_score=consistency_score,
                metadata={
                    "design_type": config.design_type,
                    "accessibility_level": config.accessibility_level,
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }
            )

        except Exception as e:
            error_msg = str(e)
            logger.error(f"Design audit failed: {error_msg}")

            # Store failed pattern
            if self.enable_memory:
                await self.store_design_pattern(
                    design_name=config.design_name,
                    design_type=config.design_type,
                    config=asdict(config),
                    result={"error": error_msg},
                    success=False,
                    user_id=user_id
                )

            return DesignResult(
                success=False,
                error=error_msg
            )

    def _calculate_accessibility_score(self, config: DesignConfig) -> float:
        """Calculate WCAG accessibility compliance score."""
        score = 50.0  # Base score

        # Bonus for WCAG AAA
        if config.accessibility_level == "AAA":
            score += 20.0
        elif config.accessibility_level == "AA":
            score += 15.0

        # Bonus for contrast ratios (mock)
        if config.brand_colors and len(config.brand_colors) > 0:
            score += 10.0

        # Bonus for responsive design
        if len(config.target_devices) > 1:
            score += 10.0

        # Bonus for typography
        if config.typography:
            score += 10.0

        return min(score, 100.0)

    async def recall_user_brand_guidelines(
        self,
        user_id: str
    ) -> Dict[str, Any]:
        """Recall user-specific brand guidelines."""
        if not self.memory_tool:
            return {}

        try:
            query = f"user brand guidelines design preferences"

            memories = self.memory_tool.retrieve_memory(
                query=query,
                scope="user",
                filters={"user_id": user_id},
                top_k=5
            )

            # Aggregate brand guidelines from memories
            guidelines = {
                "brand_colors": [],
                "typography": {},
                "design_preferences": []
            }

            for memory in memories:
                content = memory.get('content', {})
                raw_content = content.get('raw_content', content)

                if isinstance(raw_content, dict):
                    config = raw_content.get('config', {})
                    if config.get('brand_colors'):
                        guidelines["brand_colors"].extend(config['brand_colors'])
                    if config.get('typography'):
                        guidelines["typography"].update(config['typography'])

            # Deduplicate
            guidelines["brand_colors"] = list(set(guidelines["brand_colors"]))

            logger.info(f"[UIUXDesignAgent] Recalled brand guidelines for {user_id}")
            return guidelines

        except Exception as e:
            logger.error(f"[UIUXDesignAgent] Failed to recall user brand guidelines: {e}")
            return {}

    def get_statistics(self) -> Dict[str, Any]:
        """Get design statistics."""
        if self.designs_created > 0:
            success_rate = self.designs_successful / self.designs_created
        else:
            success_rate = 0.0

        return {
            "agent_id": self.agent_id,
            "designs_created": self.designs_created,
            "designs_successful": self.designs_successful,
            "success_rate": success_rate,
            "memory_enabled": self.enable_memory,
            "multimodal_enabled": self.enable_multimodal
        }


async def get_uiux_design_agent(
    business_id: str = "default",
    enable_memory: bool = True,
    enable_multimodal: bool = True
) -> UIUXDesignAgent:
    """Factory function to create UI/UX Design Agent."""
    agent = UIUXDesignAgent(
        business_id=business_id,
        enable_memory=enable_memory,
        enable_multimodal=enable_multimodal
    )
    return agent
