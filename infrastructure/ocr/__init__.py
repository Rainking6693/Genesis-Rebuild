"""
OCR Infrastructure Package

Provides OCR capabilities for Genesis agents.
"""

from .ocr_agent_tool import (
    qa_agent_screenshot_validator,
    marketing_agent_visual_analyzer,
    support_agent_screenshot_analyzer,
    support_agent_ticket_image_processor,
    analyst_agent_chart_reader,
    analyst_agent_chart_data_extractor,
    legal_agent_document_scanner,
    legal_agent_contract_parser
)

__all__ = [
    "qa_agent_screenshot_validator",
    "marketing_agent_visual_analyzer",
    "support_agent_screenshot_analyzer",
    "support_agent_ticket_image_processor",
    "analyst_agent_chart_reader",
    "analyst_agent_chart_data_extractor",
    "legal_agent_document_scanner",
    "legal_agent_contract_parser"
]
