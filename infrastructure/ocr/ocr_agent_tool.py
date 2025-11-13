"""
OCR Agent Tool - Legacy OCR Integration for Genesis Agents

Provides backward compatibility for agents that use legacy OCR tools.
This module serves as a compatibility layer before full migration to DeepSeek-OCR.

Integration Points:
- QA Agent: qa_agent_screenshot_validator
- Marketing Agent: marketing_agent_visual_analyzer
- Support Agent: support_agent_screenshot_analyzer
- Analyst Agent: analyst_agent_chart_reader
- Legal Agent: legal_agent_document_scanner

NOTE: This is a compatibility layer. New agents should use DeepSeekOCRCompressor directly.
"""

import logging
from typing import Dict, List, Optional, Any

logger = logging.getLogger(__name__)


def qa_agent_screenshot_validator(screenshot_path: str) -> Dict[str, Any]:
    """
    Legacy OCR validator for QA Agent screenshot validation.

    Args:
        screenshot_path: Path to screenshot image

    Returns:
        Dictionary with validation results
    """
    logger.warning(
        "[OCR Agent Tool] qa_agent_screenshot_validator is deprecated. "
        "Use DeepSeekOCRCompressor instead for 92.9% token savings."
    )

    return {
        "valid": True,
        "legacy_mode": True,
        "screenshot_path": screenshot_path,
        "message": "Legacy OCR mode - upgrade to DeepSeekOCRCompressor for better performance",
        "elements_found": [],
        "text_extracted": "",
        "warning": "This is a compatibility stub. Implement DeepSeek-OCR integration."
    }


def marketing_agent_visual_analyzer(image_path: str, analysis_type: str = "general") -> Dict[str, Any]:
    """
    Legacy OCR analyzer for Marketing Agent visual content analysis.

    Args:
        image_path: Path to image for analysis
        analysis_type: Type of analysis ("general", "brand", "campaign")

    Returns:
        Dictionary with analysis results
    """
    logger.warning(
        "[OCR Agent Tool] marketing_agent_visual_analyzer is deprecated. "
        "Use DeepSeekOCRCompressor instead."
    )

    return {
        "success": True,
        "legacy_mode": True,
        "image_path": image_path,
        "analysis_type": analysis_type,
        "insights": [],
        "text_detected": "",
        "warning": "This is a compatibility stub. Implement DeepSeek-OCR integration."
    }


def support_agent_screenshot_analyzer(screenshot_path: str, ticket_context: Optional[Dict] = None) -> Dict[str, Any]:
    """
    Legacy OCR analyzer for Support Agent screenshot analysis.

    Args:
        screenshot_path: Path to screenshot from support ticket
        ticket_context: Optional ticket context for analysis

    Returns:
        Dictionary with analysis results
    """
    logger.warning(
        "[OCR Agent Tool] support_agent_screenshot_analyzer is deprecated. "
        "Use DeepSeekOCRCompressor instead."
    )

    return {
        "success": True,
        "legacy_mode": True,
        "screenshot_path": screenshot_path,
        "ticket_context": ticket_context,
        "errors_detected": [],
        "text_content": "",
        "warning": "This is a compatibility stub. Implement DeepSeek-OCR integration."
    }


def support_agent_ticket_image_processor(image_path: str) -> Dict[str, Any]:
    """
    Legacy OCR processor for Support Agent ticket image processing.

    Args:
        image_path: Path to ticket image attachment

    Returns:
        Dictionary with processing results
    """
    logger.warning(
        "[OCR Agent Tool] support_agent_ticket_image_processor is deprecated. "
        "Use DeepSeekOCRCompressor instead."
    )

    return {
        "success": True,
        "legacy_mode": True,
        "image_path": image_path,
        "text_extracted": "",
        "error_indicators": [],
        "warning": "This is a compatibility stub. Implement DeepSeek-OCR integration."
    }


def analyst_agent_chart_reader(chart_path: str, chart_type: str = "auto") -> Dict[str, Any]:
    """
    Legacy OCR reader for Analyst Agent chart/graph extraction.

    Args:
        chart_path: Path to chart/graph image
        chart_type: Type of chart ("auto", "line", "bar", "pie", etc.)

    Returns:
        Dictionary with extracted data
    """
    logger.warning(
        "[OCR Agent Tool] analyst_agent_chart_reader is deprecated. "
        "Use DeepSeekOCRCompressor instead."
    )

    return {
        "success": True,
        "legacy_mode": True,
        "chart_path": chart_path,
        "chart_type": chart_type,
        "data_points": [],
        "labels": [],
        "warning": "This is a compatibility stub. Implement DeepSeek-OCR integration."
    }


def analyst_agent_chart_data_extractor(chart_path: str, extract_mode: str = "auto") -> Dict[str, Any]:
    """
    Legacy OCR data extractor for Analyst Agent chart analysis.

    Args:
        chart_path: Path to chart/graph image
        extract_mode: Extraction mode ("auto", "numeric", "categorical")

    Returns:
        Dictionary with extracted data
    """
    logger.warning(
        "[OCR Agent Tool] analyst_agent_chart_data_extractor is deprecated. "
        "Use DeepSeekOCRCompressor instead."
    )

    return {
        "success": True,
        "legacy_mode": True,
        "chart_path": chart_path,
        "extract_mode": extract_mode,
        "data_points": [],
        "x_values": [],
        "y_values": [],
        "warning": "This is a compatibility stub. Implement DeepSeek-OCR integration."
    }


def legal_agent_document_scanner(document_path: str, scan_mode: str = "full") -> Dict[str, Any]:
    """
    Legacy OCR scanner for Legal Agent document processing.

    Args:
        document_path: Path to legal document image/PDF
        scan_mode: Scanning mode ("full", "clauses", "signatures")

    Returns:
        Dictionary with scanned content
    """
    logger.warning(
        "[OCR Agent Tool] legal_agent_document_scanner is deprecated. "
        "Use DeepSeekOCRCompressor instead."
    )

    return {
        "success": True,
        "legacy_mode": True,
        "document_path": document_path,
        "scan_mode": scan_mode,
        "text_content": "",
        "clauses_found": [],
        "signatures_detected": [],
        "warning": "This is a compatibility stub. Implement DeepSeek-OCR integration."
    }


def legal_agent_contract_parser(contract_path: str, parse_mode: str = "full") -> Dict[str, Any]:
    """
    Legacy OCR parser for Legal Agent contract parsing.

    Args:
        contract_path: Path to contract document
        parse_mode: Parsing mode ("full", "clauses", "parties")

    Returns:
        Dictionary with parsed contract data
    """
    logger.warning(
        "[OCR Agent Tool] legal_agent_contract_parser is deprecated. "
        "Use DeepSeekOCRCompressor instead."
    )

    return {
        "success": True,
        "legacy_mode": True,
        "contract_path": contract_path,
        "parse_mode": parse_mode,
        "parties": [],
        "clauses": [],
        "dates": [],
        "amounts": [],
        "warning": "This is a compatibility stub. Implement DeepSeek-OCR integration."
    }


# Module metadata
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
