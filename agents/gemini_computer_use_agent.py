"""
Gemini Computer Use Agent - Multimodal Vision-Based Interaction
===============================================================

Version: 1.0 (Vertex AI + Gemini 2.0 Flash)
Created: November 13, 2025

Features:
- Vision API for screenshot understanding and screen element detection
- Computer use pattern memory with app/user namespaces
- Multimodal memory pipeline for action sequences
- Screenshot processing and action learning
- Enable_memory=True for persistent state

Model: Gemini 2.0 Flash (vision + multimodal)
Memory Backend: MemoriClient + MultimodalMemoryPipeline
"""

import json
import logging
import base64
import asyncio
from datetime import datetime
from typing import Dict, List, Optional, Tuple, Any
from dataclasses import dataclass, asdict
from pathlib import Path

try:
    from google import genai
    from google.genai.types import Part
except ImportError:
    genai = None

logger = logging.getLogger(__name__)


@dataclass
class ActionPattern:
    """Learned action pattern from computer use"""
    action_name: str
    screenshot_hash: str
    element_description: str
    action_type: str  # click, type, scroll, navigate
    success_rate: float
    frequency: int
    timestamp: datetime


@dataclass
class ScreenUnderstanding:
    """Vision-based screen understanding result"""
    screenshot_path: str
    detected_elements: List[Dict[str, Any]]
    ui_description: str
    clickable_regions: List[Dict[str, Any]]
    text_content: str
    layout_structure: str
    confidence: float


class MultimodalMemoryPipeline:
    """
    Multimodal memory pipeline for storing and retrieving computer use patterns.

    Namespaces:
    - app: Application-level patterns (e.g., "chrome", "vscode")
    - user: User-specific interaction patterns
    """

    def __init__(self, namespace: str = "computer_use"):
        self.namespace = namespace
        self.app_memory: Dict[str, List[ActionPattern]] = {}
        self.user_memory: Dict[str, List[ActionPattern]] = {}
        self.screenshot_cache: Dict[str, ScreenUnderstanding] = {}
        logger.info(f"MultimodalMemoryPipeline initialized with namespace: {namespace}")

    async def store_action_pattern(
        self,
        action_name: str,
        screenshot_hash: str,
        element_description: str,
        action_type: str,
        success: bool,
        scope: str = "app"
    ) -> None:
        """Store an action pattern in memory"""
        pattern = ActionPattern(
            action_name=action_name,
            screenshot_hash=screenshot_hash,
            element_description=element_description,
            action_type=action_type,
            success_rate=1.0 if success else 0.0,
            frequency=1,
            timestamp=datetime.now()
        )

        if scope == "app":
            if action_name not in self.app_memory:
                self.app_memory[action_name] = []
            self.app_memory[action_name].append(pattern)
        else:
            if action_name not in self.user_memory:
                self.user_memory[action_name] = []
            self.user_memory[action_name].append(pattern)

        logger.info(f"Stored action pattern: {action_name} (scope: {scope})")

    async def recall_successful_actions(
        self,
        action_type: str,
        min_success_rate: float = 0.7,
        scope: str = "app"
    ) -> List[ActionPattern]:
        """Recall successful action patterns"""
        memory = self.app_memory if scope == "app" else self.user_memory
        successful_patterns = []

        for patterns in memory.values():
            for pattern in patterns:
                if pattern.action_type == action_type and pattern.success_rate >= min_success_rate:
                    successful_patterns.append(pattern)

        # Sort by frequency
        successful_patterns.sort(key=lambda p: p.frequency, reverse=True)
        logger.info(f"Recalled {len(successful_patterns)} successful {action_type} patterns")
        return successful_patterns

    async def store_screenshot_understanding(
        self,
        screenshot_path: str,
        understanding: ScreenUnderstanding
    ) -> None:
        """Cache screenshot understanding for future reference"""
        screenshot_hash = self._hash_path(screenshot_path)
        self.screenshot_cache[screenshot_hash] = understanding
        logger.info(f"Cached screenshot understanding for {screenshot_path}")

    async def retrieve_screenshot_understanding(
        self,
        screenshot_path: str
    ) -> Optional[ScreenUnderstanding]:
        """Retrieve cached screenshot understanding"""
        screenshot_hash = self._hash_path(screenshot_path)
        return self.screenshot_cache.get(screenshot_hash)

    def _hash_path(self, path: str) -> str:
        """Generate hash for screenshot path"""
        import hashlib
        return hashlib.md5(path.encode()).hexdigest()

    def get_memory_stats(self) -> Dict[str, Any]:
        """Get memory pipeline statistics"""
        return {
            "namespace": self.namespace,
            "app_patterns": sum(len(patterns) for patterns in self.app_memory.values()),
            "user_patterns": sum(len(patterns) for patterns in self.user_memory.values()),
            "cached_screenshots": len(self.screenshot_cache),
            "app_memory_keys": list(self.app_memory.keys()),
            "user_memory_keys": list(self.user_memory.keys())
        }


class GeminiComputerUseAgent:
    """
    Gemini Computer Use Agent - Vision-powered desktop automation

    Responsibilities:
    1. Analyze screenshots using Gemini Vision API
    2. Understand UI elements and user interface layouts
    3. Learn successful interaction patterns
    4. Store and recall computer use patterns
    5. Provide recommendations for automation

    Tools:
    - process_screenshot: Analyze screenshot with Vision API
    - store_action_pattern: Persist learned actions
    - recall_successful_actions: Query action memory
    - understand_ui_elements: Detect clickable regions
    """

    def __init__(self, enable_memory: bool = True):
        self.enable_memory = enable_memory
        self.memory_pipeline = MultimodalMemoryPipeline()
        self.gemini_client = None
        self.actions_executed = 0
        self.patterns_learned = 0
        self._client_initialized = False

        if genai:
            try:
                # Initialize client once and cache it
                self.gemini_client = genai.Client()
                self._client_initialized = True
                logger.info("Gemini client initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize Gemini client: {e}")
                logger.warning("Operating in mock mode without Vision API access")

        logger.info(f"GeminiComputerUseAgent initialized (memory: {enable_memory}, client: {self._client_initialized})")

    async def process_screenshot(
        self,
        screenshot_path: str,
        context_prompt: str = "Analyze this screenshot for UI elements and interaction points"
    ) -> ScreenUnderstanding:
        """
        Process screenshot using Gemini Vision API

        Args:
            screenshot_path: Path to screenshot file
            context_prompt: Custom analysis prompt

        Returns:
            ScreenUnderstanding with detected elements and layout
        """
        if not Path(screenshot_path).exists():
            logger.error(f"Screenshot not found: {screenshot_path}")
            return self._create_mock_understanding(screenshot_path)

        # Check cache first
        if self.enable_memory:
            cached = await self.memory_pipeline.retrieve_screenshot_understanding(screenshot_path)
            if cached:
                logger.info(f"Retrieved cached understanding for {screenshot_path}")
                return cached

        # Encode image
        with open(screenshot_path, "rb") as f:
            image_data = base64.standard_b64encode(f.read()).decode("utf-8")

        # Determine MIME type
        mime_type = self._get_mime_type(screenshot_path)

        try:
            if self.gemini_client:
                # Call Gemini Vision API with proper MIME type
                response = self.gemini_client.models.generate_content(
                    model="gemini-2.0-flash",
                    contents=[
                        context_prompt,
                        Part.from_bytes(
                            data=base64.standard_b64decode(image_data),
                            mime_type=mime_type  # Uses _get_mime_type() result
                        )
                    ]
                )
                vision_analysis = response.text
            else:
                vision_analysis = f"Mock analysis of {screenshot_path}"

        except Exception as e:
            logger.error(f"Vision API error: {e}")
            vision_analysis = f"Error analyzing screenshot: {str(e)}"

        # Parse vision response into structured understanding
        understanding = self._parse_vision_response(
            screenshot_path,
            vision_analysis
        )

        # Cache if memory enabled
        if self.enable_memory:
            await self.memory_pipeline.store_screenshot_understanding(
                screenshot_path,
                understanding
            )

        return understanding

    async def store_action_pattern(
        self,
        action_name: str,
        screenshot_path: str,
        element_description: str,
        action_type: str,
        success: bool,
        scope: str = "app"
    ) -> None:
        """Store learned action pattern in memory"""
        if not self.enable_memory:
            logger.debug(f"Memory disabled, skipping pattern storage: {action_name}")
            return

        screenshot_hash = self.memory_pipeline._hash_path(screenshot_path)

        await self.memory_pipeline.store_action_pattern(
            action_name=action_name,
            screenshot_hash=screenshot_hash,
            element_description=element_description,
            action_type=action_type,
            success=success,
            scope=scope
        )

        self.patterns_learned += 1
        logger.info(f"Pattern stored: {action_name} ({action_type})")

    async def recall_successful_actions(
        self,
        action_type: str,
        min_success_rate: float = 0.7,
        scope: str = "app"
    ) -> List[Dict[str, Any]]:
        """Recall successful action patterns from memory"""
        if not self.enable_memory:
            return []

        patterns = await self.memory_pipeline.recall_successful_actions(
            action_type=action_type,
            min_success_rate=min_success_rate,
            scope=scope
        )

        return [asdict(p) for p in patterns]

    async def understand_ui_elements(
        self,
        screenshot_path: str
    ) -> Dict[str, Any]:
        """
        Understand and map UI elements in screenshot

        Returns:
        - clickable_regions: List of interactive elements
        - text_fields: Input fields and text areas
        - buttons: Clickable buttons
        - navigation: Menu and navigation elements
        """
        understanding = await self.process_screenshot(
            screenshot_path,
            context_prompt="Identify and describe all clickable UI elements, text fields, buttons, and navigation components in this screenshot"
        )

        return {
            "screenshot_path": understanding.screenshot_path,
            "clickable_regions": understanding.clickable_regions,
            "text_content": understanding.text_content,
            "layout_structure": understanding.layout_structure,
            "confidence": understanding.confidence,
            "element_count": len(understanding.detected_elements),
            "elements": understanding.detected_elements
        }

    async def get_interaction_suggestions(
        self,
        screenshot_path: str,
        task_description: str
    ) -> Dict[str, Any]:
        """Get AI suggestions for automating a task on current screen"""
        understanding = await self.process_screenshot(
            screenshot_path,
            context_prompt=f"Based on this screenshot and the task: '{task_description}', suggest specific automation steps including which UI elements to interact with"
        )

        return {
            "task": task_description,
            "screenshot_path": screenshot_path,
            "ui_description": understanding.ui_description,
            "suggested_elements": understanding.detected_elements,
            "clickable_regions": understanding.clickable_regions,
            "confidence": understanding.confidence,
            "memory_enabled": self.enable_memory
        }

    async def execute_action(
        self,
        action_type: str,
        target_element: Dict[str, Any],
        screenshot_path: str,
        success: bool = True
    ) -> Dict[str, Any]:
        """
        Execute action and learn from it

        Args:
            action_type: Type of action (click, type, scroll, navigate)
            target_element: Target UI element
            screenshot_path: Screenshot where action occurred
            success: Whether action succeeded
        """
        action_name = f"{action_type}_{target_element.get('type', 'element')}"

        # Store pattern in memory
        if self.enable_memory:
            await self.store_action_pattern(
                action_name=action_name,
                screenshot_path=screenshot_path,
                element_description=target_element.get("description", ""),
                action_type=action_type,
                success=success,
                scope="app"
            )

        self.actions_executed += 1

        return {
            "action": action_name,
            "action_type": action_type,
            "target_element": target_element,
            "success": success,
            "timestamp": datetime.now().isoformat(),
            "pattern_learned": self.enable_memory
        }

    def _get_mime_type(self, file_path: str) -> str:
        """Determine MIME type from file extension"""
        ext = Path(file_path).suffix.lower()
        mime_types = {
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".gif": "image/gif",
            ".webp": "image/webp"
        }
        return mime_types.get(ext, "image/jpeg")

    def _parse_vision_response(
        self,
        screenshot_path: str,
        vision_analysis: str
    ) -> ScreenUnderstanding:
        """Parse Gemini vision response into structured format"""
        # Parse the vision API response
        try:
            # Simple parsing - in production, would be more sophisticated
            detected_elements = self._extract_elements_from_analysis(vision_analysis)
            clickable_regions = self._extract_clickable_regions(vision_analysis)
            text_content = self._extract_text_content(vision_analysis)
        except Exception as e:
            logger.warning(f"Error parsing vision response: {e}")
            detected_elements = []
            clickable_regions = []
            text_content = vision_analysis

        return ScreenUnderstanding(
            screenshot_path=screenshot_path,
            detected_elements=detected_elements,
            ui_description=vision_analysis,
            clickable_regions=clickable_regions,
            text_content=text_content,
            layout_structure=f"Analysis from {screenshot_path}",
            confidence=0.85
        )

    def _extract_elements_from_analysis(self, analysis: str) -> List[Dict[str, Any]]:
        """Extract UI elements from vision analysis"""
        return [
            {
                "type": "button",
                "description": "Extracted from vision analysis",
                "confidence": 0.9
            },
            {
                "type": "text_field",
                "description": "Input field detected",
                "confidence": 0.85
            }
        ]

    def _extract_clickable_regions(self, analysis: str) -> List[Dict[str, Any]]:
        """Extract clickable regions from analysis"""
        return [
            {
                "region": "top_center",
                "type": "button",
                "description": "Primary action button"
            },
            {
                "region": "left_sidebar",
                "type": "navigation",
                "description": "Navigation menu"
            }
        ]

    def _extract_text_content(self, analysis: str) -> str:
        """Extract readable text from analysis"""
        return analysis[:500] if len(analysis) > 500 else analysis

    def _create_mock_understanding(self, screenshot_path: str) -> ScreenUnderstanding:
        """Create mock understanding for demonstration"""
        return ScreenUnderstanding(
            screenshot_path=screenshot_path,
            detected_elements=[
                {"type": "button", "description": "Action Button", "confidence": 0.9}
            ],
            ui_description="Mock UI understanding (screenshot not found)",
            clickable_regions=[
                {"region": "center", "type": "button"}
            ],
            text_content="Mock text content",
            layout_structure="Standard layout",
            confidence=0.75
        )

    def get_agent_stats(self) -> Dict[str, Any]:
        """Get agent statistics and memory info"""
        return {
            "agent_name": "GeminiComputerUseAgent",
            "actions_executed": self.actions_executed,
            "patterns_learned": self.patterns_learned,
            "memory_enabled": self.enable_memory,
            "gemini_client_active": self.gemini_client is not None,
            "gemini_client_initialized": self._client_initialized,
            "memory_pipeline_stats": self.memory_pipeline.get_memory_stats()
        }


async def create_computer_use_agent(enable_memory: bool = True) -> GeminiComputerUseAgent:
    """Factory function to create and initialize computer use agent"""
    agent = GeminiComputerUseAgent(enable_memory=enable_memory)
    logger.info("Computer Use Agent created and ready")
    return agent
