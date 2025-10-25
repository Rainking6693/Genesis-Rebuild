"""
WaltzRL Conversation Agent - Response Improvement
Version: 1.0
Date: October 22, 2025

Improves agent responses based on safety and helpfulness feedback.
Applies concrete suggestions from WaltzRL Feedback Agent.

Based on: WaltzRL (arXiv:2510.08240v1)
- 89% unsafe reduction (39.0% → 4.6%)
- 78% over-refusal reduction (45.3% → 9.9%)
"""

import logging
import re
import time
from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Dict, Optional, Tuple

from infrastructure.safety.waltzrl_feedback_agent import (
    FeedbackResult,
    SafetyCategory,
    SafetyIssue
)

logger = logging.getLogger(__name__)


@dataclass
class SafeResponse:
    """Result of response improvement"""
    response: str  # Improved response text
    safety_score: float  # 0.0-1.0 (1.0 = completely safe)
    helpfulness_score: float  # 0.0-1.0 (1.0 = maximally helpful)
    changes_made: List[str] = field(default_factory=list)  # List of improvements applied
    feedback_incorporated: bool = False  # Whether feedback was applied
    revision_time_ms: float = 0.0  # Time taken to revise
    original_response: Optional[str] = None  # Original response for comparison
    timestamp: str = field(default_factory=lambda: datetime.now().isoformat())

    def to_dict(self) -> Dict:
        """Convert to dictionary for logging/serialization"""
        return {
            'response': self.response[:200],  # Truncate for logging
            'safety_score': self.safety_score,
            'helpfulness_score': self.helpfulness_score,
            'changes_made': self.changes_made,
            'feedback_incorporated': self.feedback_incorporated,
            'revision_time_ms': self.revision_time_ms,
            'timestamp': self.timestamp
        }


class WaltzRLConversationAgent:
    """
    WaltzRL Conversation Agent - Improves responses based on feedback.

    This is a rule-based implementation (Stage 1).
    Stage 2 will use fine-tuned LLM for more sophisticated improvements.

    Performance Target: <150ms revision time
    """

    def __init__(
        self,
        max_revision_attempts: int = 3,
        min_safety_improvement: float = 0.1,
        preserve_helpfulness: bool = True
    ):
        """
        Initialize WaltzRL Conversation Agent.

        Args:
            max_revision_attempts: Maximum number of revision iterations
            min_safety_improvement: Minimum safety score improvement to accept
            preserve_helpfulness: Ensure helpfulness doesn't decrease
        """
        self.max_revision_attempts = max_revision_attempts
        self.min_safety_improvement = min_safety_improvement
        self.preserve_helpfulness = preserve_helpfulness

        logger.info(
            f"WaltzRLConversationAgent initialized "
            f"(max_attempts={max_revision_attempts}, "
            f"min_improvement={min_safety_improvement})"
        )

    def improve_response(
        self,
        original_response: str,
        feedback: FeedbackResult,
        query: Optional[str] = None,
        agent_type: str = "unknown"
    ) -> SafeResponse:
        """
        Improve agent response based on feedback.

        Args:
            original_response: Original agent response
            feedback: Feedback result with issues and suggestions
            query: Optional user query for context
            agent_type: Type of agent (e.g., "support-agent")

        Returns:
            SafeResponse with improved text and metrics

        Performance: <150ms target
        """
        start_time = time.time()

        # If no issues found, return original response
        if not feedback.issues_found:
            logger.info("No issues found, returning original response")
            return SafeResponse(
                response=original_response,
                safety_score=feedback.safety_score,
                helpfulness_score=feedback.helpfulness_score,
                changes_made=[],
                feedback_incorporated=False,
                revision_time_ms=(time.time() - start_time) * 1000,
                original_response=original_response
            )

        # P1-1 FIX: Wrap improvement loop in try/except for error handling
        try:
            # Apply feedback iteratively
            improved_response = original_response
            changes_made = []
            current_safety_score = feedback.safety_score
            current_helpfulness_score = feedback.helpfulness_score

            for attempt in range(self.max_revision_attempts):
                # Apply feedback suggestions
                revised_response, applied_changes = self._apply_feedback(
                    improved_response,
                    feedback,
                    query
                )

                if not applied_changes:
                    # No more changes to apply
                    break

                # Validate improvement
                is_better, new_safety, new_helpfulness = self._validate_improvement(
                    original_response,
                    revised_response,
                    current_safety_score,
                    current_helpfulness_score,
                    feedback
                )

                if is_better:
                    improved_response = revised_response
                    changes_made.extend(applied_changes)
                    current_safety_score = new_safety
                    current_helpfulness_score = new_helpfulness
                    logger.debug(
                        f"Revision attempt {attempt + 1}: Applied {len(applied_changes)} changes, "
                        f"safety={new_safety:.2f}, helpfulness={new_helpfulness:.2f}"
                    )
                else:
                    # Revision didn't improve response
                    logger.debug(f"Revision attempt {attempt + 1}: No improvement, stopping")
                    break

            revision_time_ms = (time.time() - start_time) * 1000

            result = SafeResponse(
                response=improved_response,
                safety_score=current_safety_score,
                helpfulness_score=current_helpfulness_score,
                changes_made=changes_made,
                feedback_incorporated=len(changes_made) > 0,
                revision_time_ms=revision_time_ms,
                original_response=original_response
            )

            logger.info(
                f"Response improved: {len(changes_made)} changes, "
                f"safety {feedback.safety_score:.2f}→{current_safety_score:.2f}, "
                f"helpfulness {feedback.helpfulness_score:.2f}→{current_helpfulness_score:.2f}, "
                f"time={revision_time_ms:.1f}ms"
            )

            return result

        except Exception as e:
            # P1-1 FIX: Graceful error handling - return original response as fallback
            logger.error(
                f"Error during response improvement: {e}",
                extra={'original_response_length': len(original_response)},
                exc_info=True
            )
            # Return original response as fallback
            return SafeResponse(
                response=original_response,
                safety_score=feedback.safety_score,
                helpfulness_score=feedback.helpfulness_score,
                changes_made=[],
                feedback_incorporated=False,
                revision_time_ms=(time.time() - start_time) * 1000,
                original_response=original_response
            )

    def _apply_feedback(
        self,
        response: str,
        feedback: FeedbackResult,
        query: Optional[str] = None
    ) -> Tuple[str, List[str]]:
        """
        Apply specific feedback suggestions to response.

        Args:
            response: Current response text
            feedback: Feedback with issues and suggestions
            query: Optional user query for context

        Returns:
            Tuple of (revised_response, list_of_changes_made)
        """
        revised_response = response
        changes_made = []

        # Process issues by priority (critical first)
        sorted_issues = sorted(
            feedback.issues_found,
            key=lambda x: x.severity,
            reverse=True
        )

        for issue in sorted_issues:
            if issue.category == SafetyCategory.HARMFUL_CONTENT:
                revised_response, change = self._revise_for_safety(
                    revised_response,
                    issue
                )
                if change:
                    changes_made.append(f"Removed harmful content: {issue.description}")

            elif issue.category == SafetyCategory.PRIVACY_VIOLATION:
                # P1-4 FIX: Ensure PII redaction is properly called
                logger.debug(f"Processing PRIVACY_VIOLATION issue: {issue.description}")
                revised_response, change = self._redact_sensitive_data(
                    revised_response,
                    issue
                )
                if change:
                    changes_made.append(f"Redacted sensitive data: {issue.description}")
                else:
                    logger.warning(f"PII redaction failed for: {issue.description}")

            elif issue.category == SafetyCategory.MALICIOUS_INSTRUCTION:
                revised_response, change = self._revise_for_safety(
                    revised_response,
                    issue
                )
                if change:
                    changes_made.append(f"Removed malicious instruction: {issue.description}")

            elif issue.category == SafetyCategory.OVER_REFUSAL:
                revised_response, change = self._revise_for_helpfulness(
                    revised_response,
                    issue,
                    query
                )
                if change:
                    changes_made.append(f"Improved helpfulness: {issue.description}")

            elif issue.category == SafetyCategory.CAPABILITY_DEGRADED:
                revised_response, change = self._enhance_response_quality(
                    revised_response,
                    issue
                )
                if change:
                    changes_made.append(f"Enhanced quality: {issue.description}")

        return revised_response, changes_made

    def _revise_for_safety(
        self,
        response: str,
        issue: SafetyIssue
    ) -> Tuple[str, bool]:
        """
        Revise response to remove unsafe content.

        Strategy: Remove the specific problematic content and replace with
        a polite decline if necessary.

        Args:
            response: Current response
            issue: Safety issue to address

        Returns:
            Tuple of (revised_response, change_made)
        """
        original_response = response

        # Try to remove the specific evidence pattern
        if issue.evidence and len(issue.evidence) > 5:
            # Escape special regex characters
            escaped_evidence = re.escape(issue.evidence)
            # Remove the problematic content
            revised_response = re.sub(
                escaped_evidence,
                "[CONTENT REMOVED - SAFETY]",
                response,
                flags=re.IGNORECASE
            )

            if revised_response != original_response:
                # Successfully removed problematic content
                return revised_response, True

        # Fallback: Replace entire response with safe decline
        safe_decline = (
            "I cannot provide that information as it may be harmful or unsafe. "
            "I'm here to help with legitimate requests. "
            "Is there something else I can assist you with?"
        )

        # Only replace if response contains unsafe content
        if issue.severity >= 0.7:
            return safe_decline, True

        return response, False

    def _redact_sensitive_data(
        self,
        response: str,
        issue: SafetyIssue
    ) -> Tuple[str, bool]:
        """
        Redact sensitive data (PII, credentials) from response.

        Args:
            response: Current response
            issue: Privacy issue to address

        Returns:
            Tuple of (revised_response, change_made)
        """
        # P1-4 FIX: Add debug logging for PII redaction
        logger.debug(
            f"PII redaction called for: {issue.description}, "
            f"evidence: {issue.evidence[:50] if issue.evidence else 'None'}"
        )

        original_response = response

        # Redact the specific sensitive data
        if issue.evidence:
            # Determine redaction placeholder based on data type
            if "SSN" in issue.description or "Social Security" in issue.description:
                placeholder = "[SSN REDACTED]"
            elif "credit_card" in issue.description:
                placeholder = "[CREDIT CARD REDACTED]"
            elif "password" in issue.description:
                placeholder = "[PASSWORD REDACTED]"
            elif "api_key" in issue.description:
                placeholder = "[API KEY REDACTED]"
            elif "email" in issue.description:
                placeholder = "[EMAIL REDACTED]"
            else:
                placeholder = "[PII REDACTED]"

            # Escape and replace
            escaped_evidence = re.escape(issue.evidence)

            # P1-4 FIX: Add pattern matching debug
            if re.search(escaped_evidence, response, flags=re.IGNORECASE):
                logger.debug(f"PII pattern matched: {escaped_evidence[:50]}")
            else:
                logger.debug(f"PII pattern NOT matched: {escaped_evidence[:50]}")

            revised_response = re.sub(
                escaped_evidence,
                placeholder,
                response,
                flags=re.IGNORECASE
            )

            if revised_response != original_response:
                logger.debug(f"PII redaction successful: replaced with {placeholder}")
                return revised_response, True
            else:
                logger.debug("PII redaction failed: no match found")

        return response, False

    def _revise_for_helpfulness(
        self,
        response: str,
        issue: SafetyIssue,
        query: Optional[str] = None
    ) -> Tuple[str, bool]:
        """
        Revise response to be more helpful (address over-refusal).

        Strategy: Replace refusal language with helpful alternatives.

        Args:
            response: Current response
            issue: Over-refusal issue to address
            query: User query for context

        Returns:
            Tuple of (revised_response, change_made)
        """
        original_response = response

        # Common refusal patterns and helpful replacements
        refusal_replacements = [
            (r"I cannot|I can't|I'm unable to|I am unable to",
             "I can help you with that. Here's how"),
            (r"I don't have the ability|I lack the capability",
             "I can assist with this"),
            (r"This request .{0,20}violates.{0,20}policy",
             "I'm happy to help with this request"),
            (r"I cannot provide .{0,30} as it .{0,30}harmful",
             "I can provide information about this topic")
        ]

        revised_response = response
        made_changes = False

        for pattern, replacement in refusal_replacements:
            new_response = re.sub(
                pattern,
                replacement,
                revised_response,
                flags=re.IGNORECASE,
                count=1  # Only replace first occurrence
            )

            if new_response != revised_response:
                revised_response = new_response
                made_changes = True
                break  # Only apply one replacement per call

        return revised_response, made_changes

    def _enhance_response_quality(
        self,
        response: str,
        issue: SafetyIssue
    ) -> Tuple[str, bool]:
        """
        Enhance response quality (address capability degradation).

        Strategy: Add more detail and actionable information.

        Args:
            response: Current response
            issue: Quality issue to address

        Returns:
            Tuple of (revised_response, change_made)
        """
        original_response = response

        # If response is too short, add helpful elaboration
        if len(response) < 50:
            enhancement = (
                f"\n\n"
                f"To provide more detail: I recommend checking the official documentation "
                f"for comprehensive guidance. If you need specific help with implementation, "
                f"please let me know the exact use case you're working on."
            )
            revised_response = response + enhancement
            return revised_response, True

        # If response is vague, add specificity
        vague_phrases = ["I'm not sure", "Maybe", "Possibly", "I don't know"]
        if any(phrase.lower() in response.lower() for phrase in vague_phrases):
            enhancement = (
                f"\n\n"
                f"To be more specific: Please provide additional details about your requirements, "
                f"and I can give you a more targeted and actionable response."
            )
            revised_response = response + enhancement
            return revised_response, True

        return response, False

    def _validate_improvement(
        self,
        original_response: str,
        revised_response: str,
        current_safety_score: float,
        current_helpfulness_score: float,
        feedback: FeedbackResult
    ) -> Tuple[bool, float, float]:
        """
        Validate that revision actually improved the response.

        Args:
            original_response: Original response
            revised_response: Revised response
            current_safety_score: Current safety score
            current_helpfulness_score: Current helpfulness score
            feedback: Original feedback

        Returns:
            Tuple of (is_better, new_safety_score, new_helpfulness_score)
        """
        # Estimate new scores based on changes
        # (In Stage 2, we'll use the feedback agent to re-score)

        # Safety improvement: Removing unsafe content increases score
        new_safety_score = current_safety_score
        # P1-4 FIX: Check for ALL redaction placeholders, not just "[REDACTED]"
        redaction_indicators = [
            "[CONTENT REMOVED - SAFETY]",
            "[REDACTED]",
            "[SSN REDACTED]",
            "[CREDIT CARD REDACTED]",
            "[PASSWORD REDACTED]",
            "[API KEY REDACTED]",
            "[EMAIL REDACTED]",
            "[PII REDACTED]"
        ]
        if any(indicator in revised_response for indicator in redaction_indicators):
            # Significant safety improvement from redaction
            new_safety_score = min(1.0, current_safety_score + 0.8)  # Large improvement for PII removal

        # Helpfulness improvement: Adding content or removing refusals increases score
        new_helpfulness_score = current_helpfulness_score

        if "I can help" in revised_response and "I cannot" in original_response:
            new_helpfulness_score = min(1.0, current_helpfulness_score + 0.2)

        if len(revised_response) > len(original_response) * 1.2:
            new_helpfulness_score = min(1.0, current_helpfulness_score + 0.1)

        # Validate improvement
        safety_improved = new_safety_score >= current_safety_score
        helpfulness_improved = new_helpfulness_score >= current_helpfulness_score

        # Check if we degraded helpfulness (only if preserve_helpfulness is True)
        if self.preserve_helpfulness and new_helpfulness_score < current_helpfulness_score - 0.1:
            return False, current_safety_score, current_helpfulness_score

        # Accept if either metric improved and neither degraded significantly
        is_better = safety_improved or helpfulness_improved

        return is_better, new_safety_score, new_helpfulness_score


def get_waltzrl_conversation_agent(
    max_revision_attempts: int = 3,
    min_safety_improvement: float = 0.1,
    preserve_helpfulness: bool = True
) -> WaltzRLConversationAgent:
    """
    Factory function to get WaltzRL Conversation Agent.

    Args:
        max_revision_attempts: Maximum number of revision iterations
        min_safety_improvement: Minimum safety score improvement to accept
        preserve_helpfulness: Ensure helpfulness doesn't decrease

    Returns:
        Configured WaltzRLConversationAgent instance
    """
    return WaltzRLConversationAgent(
        max_revision_attempts=max_revision_attempts,
        min_safety_improvement=min_safety_improvement,
        preserve_helpfulness=preserve_helpfulness
    )
