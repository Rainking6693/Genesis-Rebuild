"""
VOIX Browser Automation Module

VOIX (Voice of Intent eXchange) Framework Integration
Paper: arXiv:2511.11287 - Building the Web for Agents

This module provides:
- VOIX detection and execution
- Hybrid automation (VOIX + fallback)
- Tool and context tag parsing
"""

from .voix_detector import VoixDetector, VoixTool, VoixContext
from .voix_executor import VoixExecutor, VoixExecutionResult
from .hybrid_automation import HybridAutomation, AutomationResult

__all__ = [
    "VoixDetector",
    "VoixTool",
    "VoixContext",
    "VoixExecutor",
    "VoixExecutionResult",
    "HybridAutomation",
    "AutomationResult",
]

